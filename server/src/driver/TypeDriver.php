<?php

abstract class AuthType {
	const Root = 'root';
	const Researcher = 'researcher';
	const Participant = 'participant';
}

/**
 * All LAMP API actions are designated from their class definitions to specific
 * drivers implemented as PHP Traits. If the implementation detail underlying the
 * API changes, add a new `TypeDriver` and/or extend it for new functionality.
 */
trait TypeDriver {

    /**
     * Return internal access to the underlying MS-SQL DB.
     */
    private static function db() {
        static $pdo = null;
        if ($pdo === null) {
            try {
                $pdo = new PDO('sqlsrv:server='.DB_HOST.';database='.DB_NAME, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION 
                ]);
                $pdo->exec('SET QUOTED_IDENTIFIER ON');
            } catch (PDOException $e) {
                throw new LAMPException("{$e->getMessage()}\n{$e->getTraceAsString()}", 500);
            }
        }
        return $pdo;
    }

    /**
     * Access the LAMP v0.1 DB with an arbitrary Transact-SQL statement.
     */
    public static function lookup(

        /**
         * The Transact-SQL query to execute on the LAMP v0.1 DB.
         */
        $sql_query, 

        /**
         * If the SQL query is to return a single JSON object, mark this as `true`.
         */
        $use_json = false
    ) {
        if ($sql_query === null) return null;
        try {
            $pre_exec = microtime(true);
            $result = self::db()->query($sql_query)->fetchAll(PDO::FETCH_ASSOC);
            $exec_time = microtime(true) - $pre_exec;
            log::sys('SQL execution took '.$exec_time.' seconds.');

            if (count($result) === 0)
                return [];
            if ($use_json === false) {
                return $result;
            } else {
                return json_decode(implode('', array_map(function($a) {
                    return array_values($a)[0];
                }, $result)));
            }
        } catch(PDOException $e) {
	        log::err($e);
            throw new LAMPException("{$e->getMessage()}\n{$e->getTraceAsString()}", 500);
        }
    }

    /**
     * Modify the LAMP v0.1 DB with an arbitrary Transact-SQL statement.
     */
    public static function perform(

        /**
         * The Transact-SQL query to execute on the LAMP v0.1 DB.
         */
        $sql_query,

        /**
         * The variable substitutions to apply to the query above.
         */
        $substitutions = []
    ) {
        if ($sql_query === null) return null;
        try {
            $pre_exec = microtime(true);
            $obj = self::db()->prepare($sql_query)->execute($substitutions);
            $exec_time = microtime(true) - $pre_exec;
            log::sys('SQL execution took '.$exec_time.' seconds.');
            return $obj;
        } catch(PDOException $e) {
	        log::err($e);
            throw new LAMPException("{$e->getMessage()}\n{$e->getTraceAsString()}", 500);
        }
    }

    /**
     * Returns the identifier that corresponds to the authenticated user if any.
     */
    public static function me() {

        // Get the auth header parts.
        $parts = LAMP::auth_header();
        if (count($parts) !== 2)
            throw new LAMPException("invalid credentials", 403);

        // We're a Researcher.
        if (strpos($parts[0], '@') !== false) { // EMAIL
            $value = LAMP::encrypt($parts[0]);
            $result = self::lookup("
                SELECT AdminID 
                FROM Admin
                WHERE IsDeleted = 0 AND Email = '{$value}';
            ");
            if (count($result) == 0) return null;
            return new TypeID([Researcher::class, $result[0]['AdminID']]);

        // We're a Participant.
        } else if (preg_match('#^G?U#', $parts[0]) === 1) { // UID
            $_id = LAMP::encrypt($parts[0]);
            $result = self::lookup("
                SELECT StudyId 
                FROM Users
                WHERE isDeleted = 0 AND StudyId = '{$_id}';
            ");
            if (count($result) == 0) return null;
            return $parts[0];
        } else return null;
    }

    /**
     * Authenticate and authorize a LAMP API action.
     * The callback function should not consider AuthType::Root.
     *
     * Note: header format is "username:password".
     */
    public static function authorize(

        /**
         * Function of type `function($type, $value): $is_ok`.
         * Possible values are `String` if the type is `Participant`, or `TypeID` otherwise.
         */
        $callback
    ) {
        // Get the auth header parts.
        $parts = LAMP::auth_header();
        if (count($parts) !== 2)
            throw new LAMPException("invalid credentials", 403);
        $value = $parts[0];

        // Step 1: Authenticate
        // Confirm that there exists a valid Researcher or Participant with
        // the specified ID or Email, along with encrypted password hash.
        $type = null;

        // Authenticate as Root.
        if ($parts[0] == 'root' && $parts[1] === DEPLOY_PASS) {
            return; // OK!

        // Authenticate as a Researcher.
        } else if (strpos($parts[0], '@') !== false) { // EMAIL
            $value = LAMP::encrypt($value);
            $result = self::lookup("
                SELECT AdminID, Password 
                FROM Admin
                WHERE IsDeleted = 0 AND Email = '{$value}';
            ");
            if (count($result) == 0 || 
                    $parts[1] !== LAMP::decrypt($result[0]['Password'], false, 'oauth'))
                throw new LAMPException("invalid credentials", 403);
            else 
                $value = (new TypeID([Researcher::class, $result[0]['AdminID']]))->part(1);
            $type = AuthType::Researcher;

        // Authenticate as a Participant.
        } else if (preg_match('#^G?U#', $parts[0]) === 1) { // UID
            $_id = LAMP::encrypt($parts[0]);
            $result = self::lookup("
                SELECT Password 
                FROM Users
                WHERE isDeleted = 0 AND StudyId = '{$_id}';
            ");
            if (count($result) == 0 || 
                    $parts[1] !== LAMP::decrypt($result[0]['Password'], false, 'oauth'))
                throw new LAMPException("invalid credentials", 403);
            $type = AuthType::Participant;

        } else throw new LAMPException("invalid credentials", 403);

        // Step 2: Authorize
        // If non-root, confirm that the authenticated object has action rights.
        if ($callback($type, $value) !== true)
            throw new LAMPException("access restricted", 403);
    }

	/**
	 *
	 */
	public static function type_parent_of(

		/**
		 * The origin type in the LAMP v0.1 DB.
		 */
		$from,

		/**
		 * The destination type the LAMP v0.1 DB.
		 */
		$to
	) {
		static $mapping = null;
		if ($mapping === null) {
			$mapping = [
				ResultEvent::class => [Activity::class, Participant::class, Study::class, Researcher::class],
				EnvironmentEvent::class => [Participant::class, Study::class, Researcher::class],
					FitnessEvent::class => [Participant::class, Study::class, Researcher::class],
					MetadataEvent::class => [Participant::class, Study::class, Researcher::class],
					SensorEvent::class => [Participant::class, Study::class, Researcher::class],
					Activity::class => [Study::class, Researcher::class],
					Participant::class => [Study::class, Researcher::class],
					Study::class => [Researcher::class],
					Researcher::class => [],
				];
		}

		// Handle early bail-out if no conversion exists or should occur.
		if (!isset($mapping[$from]))
			return null;

		// Execute the appropriate conversion.
		$val = $mapping[$from][$to];
		if ($val === null)
			throw new LAMPException("invalid type", 404);
		return $val;
	}

	/**
     * Convert an internal ID of one type to the ID of its parent type, if any.
     */
    public static function parent_of(

        /**
         * The identifier to convert in the LAMP v0.1 DB.
         */
        $id,

        /**
         * The type of identifier being converted in the LAMP v0.1 DB.
         */
        $from,

        /**
         * The parent type to convert to in the LAMP v0.1 DB.
         */
        $to
    ) {
        static $mapping = null;
        if ($mapping === null) {
            $mapping = [
                Participant::class => [
                    Researcher::class => function($id) {
                        $id = LAMP::encrypt($id);
                        $result = self::lookup("
                            SELECT AdminID AS value
                            FROM Users
                            WHERE IsDeleted = 0 AND StudyId = '{$id}';
                        ");
                        return count($result) === 0 ? null : 
                            new TypeID([Researcher::class, $result[0]['value']]);
                    },
                ],
                Activity::class => [
                    Researcher::class => function($id) {
	                    if ($id->part(1) === 1 /* survey */) {
                            $result = self::lookup("
                                SELECT AdminID AS value
                                FROM Survey
                                WHERE IsDeleted = 0 AND SurveyID = '{$id->part(2)}';
                            ");
                            return count($result) === 0 ? null : 
                                new TypeID([Researcher::class, $result[0]['value']]);
                        } else {

		                    // Only "Survey" types lack an encoded AdminID; regardless, verify their deletion.
		                    $result = self::lookup("
	                            SELECT AdminID AS value
	                            FROM Admin
	                            WHERE IsDeleted = 0 AND AdminID = '{$id->part(3)}';
                        	");
		                    return count($result) === 0 ? null :
			                    new TypeID([Researcher::class, $result[0]['value']]);
	                    }
                    },
                ],
                EnvironmentEvent::class => [
                    Participant::class => function($id) { 
                        $result = self::lookup("
                            SELECT StudyId
                            FROM Locations
                            LEFT JOIN Users
                                ON Users.UserID = Locations.UserID
                            WHERE LocationID = '{$id->part(1)}';
                        ");
                        return count($result) === 0 ? null : 
                            LAMP::decrypt($result[0]['value']);
                    },
                    Researcher::class => function($id) { 
                        $result = self::lookup("
                            SELECT AdminID
                            FROM Locations
                            LEFT JOIN Users
                                ON Users.UserID = Locations.UserID
                            WHERE LocationID = '{$id->part(1)}';
                        ");
                        return count($result) === 0 ? null : 
                            new TypeID([Researcher::class, $result[0]['value']]);
                    },
                ],
                FitnessEvent::class => [
                    Participant::class => function($id) { 
                        $result = self::lookup("
                            SELECT StudyId
                            FROM HealthKit_DailyValues
                            LEFT JOIN Users
                                ON Users.UserID = HealthKit_DailyValues.UserID
                            WHERE HKDailyValueID = '{$id->part(1)}';
                        ");
                        return count($result) === 0 ? null : 
                            LAMP::decrypt($result[0]['value']);
                    },
                    Researcher::class => function($id) { 
                        $result = self::lookup("
                            SELECT AdminID
                            FROM HealthKit_DailyValues
                            LEFT JOIN Users
                                ON Users.UserID = HealthKit_DailyValues.UserID
                            WHERE HKDailyValueID = '{$id->part(1)}';
                        ");
                        return count($result) === 0 ? null : 
                            new TypeID([Researcher::class, $result[0]['value']]);
                    },
                ],
	            MetadataEvent::class => [
		            Participant::class => function($id) {
			            return null;
		            },
		            Researcher::class => function($id) {
			            return null;
		            },
	            ],
	            SensorEvent::class => [
		            Participant::class => function($id) {
			            return null;
		            },
		            Researcher::class => function($id) {
			            return null;
		            },
	            ],
	            ResultEvent::class => [
		            Activity::class => function($id) {
			            return null;
		            },
		            Participant::class => function($id) {
                        return null;
                    },
                    Researcher::class => function($id) { 
                        return null;
                    },
                ],
            ];
        }

        // The Study type is virtualized atop Researcher.
        if ($from === Study::class)
            $from = Researcher::class;
        if ($to === Study::class)
            $to = Researcher::class;

        // Handle early bail-out if no conversion exists or should occur.
        if ($from !== Participant::class && $id->part(0) !== $from)
            throw new LAMPException("invalid identifier", 404);
        if ($from === $to)
            return $id;
        if (!isset($mapping[$from][$to]))
            return null;

        // Execute the appropriate conversion.
        $val = $mapping[$from][$to]($id);
        if ($val === null)
            throw new LAMPException("invalid identifier", 404);
        return $val;
    }

    /**
     * Get a set of attachments for the given participant. TODO.
     */
    private static function _getX(

        /**
         * The participant's parent admin ID to lookup.
         */
        $parent_id,

        /**
         * 
         */
        $child_type,

        /**
         * 
         */
        $key 
    ) {
        $result = self::lookup("
            SELECT TOP 1
                * 
            FROM LAMP_Aux.dbo.OOLAttachmentLinker
            WHERE 
                AttachmentKey = '$key'
                AND ObjectID = '$parent_id'
                AND ChildObjectType = '$child_type';
        ");
        if (count($result) === 0)
            return null;
        return $result[0];
    }

    /**
     * Get a set of attachments for the given participant. TODO.
     */
    private static function _setX(

        /**
         * The participant's parent admin ID to lookup.
         */
        $parent_id,

        /**
         * 
         */
        $child_type,

        /**
         * 
         */
        $key,

        /**
         *
         */
        $script,

        /**
         *
         */
        $packages
    ) {
        $script = self::db()->quote($script);
        $packages = json_encode($packages);
        return self::perform("
            MERGE INTO LAMP_Aux.dbo.OOLAttachmentLinker 
                WITH (HOLDLOCK) AS Output
            USING (SELECT
                '$key' AS AttachmentKey,
                '$parent_id' AS ObjectID,
                '$child_type' AS ChildObjectType
            ) AS Input(AttachmentKey, ObjectID, ChildObjectType)
            ON (
                Output.AttachmentKey = Input.AttachmentKey 
                AND Output.ObjectID = Input.ObjectID 
                AND Output.ChildObjectType = Input.ChildObjectType 
            )
            WHEN MATCHED THEN 
                UPDATE SET ScriptContents = $script, ReqPackages = '$packages'
            WHEN NOT MATCHED THEN 
                INSERT (
                    AttachmentKey, ObjectID, ChildObjectType, 
                    ScriptType, ScriptContents, ReqPackages
                )
                VALUES (
                    '$key', '$parent_id', '$child_type',
                    'rscript', $script, '$packages'
                );
        ");
    }
}
