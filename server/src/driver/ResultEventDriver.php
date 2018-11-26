<?php
require_once __DIR__ . '/TypeDriver.php';

trait ResultEventDriver {
	use TypeDriver;

	/**
	 * Get a set of `ResultEvent`s matching the criteria parameters.
	 */
	private static function _select(

		/**
		 * The `*ResultID` column of any `CTest_*Result` table in the LAMP v0.1 DB.
		 */
		$result_id = null,

		/**
		 * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
		 */
		$user_id = null,

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id = null
	) {
		$user_id = LAMP::encrypt($user_id);
		$cond1 = $user_id !== null ? "AND Users.StudyId = '$user_id'" : '';
		$cond2 = $admin_id !== null ? "AND Users.AdminID = '$admin_id'" : '';

		// Helpers go here:
		$sql_if = function($cond, $x, $y) { return $cond ? $x : $y; };
		$sql_iff = function($x, $y) { return $x ?: $y; };

		// Collect the set of legacy Activity tables and stitch the full query.
		$tableset = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");
		$full_q = array_map(function ($entry) use($sql_if, $sql_iff, $cond1, $cond2) { return
			"[{$entry['Name']}](value) AS (
                SELECT
                    ({$entry['ActivityIndexID']}) AS ctid,
                    [{$entry['IndexColumnName']}] AS id,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', [{$entry['StartTimeColumnName']}]) AS timestamp,
                    DATEDIFF_BIG(MS, '1970-01-01', [{$entry['EndTimeColumnName']}]) - 
                        DATEDIFF_BIG(MS, '1970-01-01', [{$entry['StartTimeColumnName']}]) AS duration,
                    {$sql_if($entry['Slot1Name'] == null, '', 
                        "[{$entry['Slot1ColumnName']}] AS [static_data.{$entry['Slot1Name']}],")}
                    {$sql_if($entry['Slot2Name'] == null, '', 
                        "[{$entry['Slot2ColumnName']}] AS [static_data.{$entry['Slot2Name']}],")}
                    {$sql_if($entry['Slot3Name'] == null, '', 
                        "[{$entry['Slot3ColumnName']}] AS [static_data.{$entry['Slot3Name']}],")}
                    {$sql_if($entry['Slot4Name'] == null, '', 
                        "[{$entry['Slot4ColumnName']}] AS [static_data.{$entry['Slot4Name']}],")}
                    {$sql_if($entry['Slot5Name'] == null, '', 
                        "[{$entry['Slot5ColumnName']}] AS [static_data.{$entry['Slot5Name']}],")}
                    ({$sql_if($entry['TemporalTableName'] == null, 'NULL', "
                        SELECT
                            {$sql_if($entry['Temporal1ColumnName'] != null, 
                                '[' . $entry['Temporal1ColumnName'] . ']', 
                                '(NULL)')} AS item,
                            {$sql_if($entry['Temporal2ColumnName'] != null, 
                                '[' . $entry['Temporal2ColumnName'] . ']', 
                                '(NULL)')} AS value,
                            {$sql_if($entry['Temporal3ColumnName'] != null, 
                                '[' . $entry['Temporal3ColumnName'] . ']', 
                                '(NULL)')} AS type,
                            {$sql_if($entry['Temporal4ColumnName'] != null, 
                                'CAST(CAST([' . $entry['Temporal4ColumnName'] . '] AS float) * 1000 AS bigint)', 
                                '(NULL)')} AS duration,
                            {$sql_if($entry['Temporal5ColumnName'] != null, 
                                '[' . $entry['Temporal5ColumnName'] . ']', 
                                '(NULL)')} AS level
                        FROM [{$entry['TemporalTableName']}]
                        WHERE [{$entry['TableName']}].[{$entry['IndexColumnName']}] = [{$entry['TemporalTableName']}].[{$entry['IndexColumnName']}]
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ")}) AS temporal_events
                FROM [{$entry['TableName']}]
                LEFT JOIN Users
                    ON [{$entry['TableName']}].UserID = Users.UserID
                WHERE 1=1
                    {$cond1}
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            )"; }, $tableset);

		// Perform the dynamic SQL lookup.
		$usage = "\n            SELECT X.value FROM (\n" .
			implode(" UNION ALL\n", array_map(function ($entry) {
				return "                SELECT value FROM [{$entry['Name']}]";
			}, $tableset)) . "\n) X;\n";
		$dynamicSQL = 'WITH ' . implode(", ", $full_q) . $usage;
		$result = self::lookup($dynamicSQL);

		// We need to do some pre-processing because the JSON we get from
		// SQL Server is just frankly way too massive.
		$result = array_merge(...array_map(function($x) {
			return json_decode($x['value']) ?: []; // inner JSON
		}, $result)); // unpack and flatten all sub-arrays
		if (count($result) === 0)
			return null;

		// Map from SQL DB to the local ResultEvent type.
		return array_map(function($raw) {

			// Map internal ID sub-components into the single mangled ID form.
			// FIXME: Currently it's not feasible to map SurveyID from SurveyName.
			$ctid = array_drop($raw, 'ctid');
			$aid = array_drop($raw, 'aid');
			$raw->id = new TypeID([ResultEvent::class, $ctid, $raw->id]);
			$raw->activity = new TypeID([Activity::class, $ctid, $aid, 0 /* SurveyID */]);

			// Decrypt all static data/temporal event properties.
			if (isset($raw->static_data->survey_name))
				$raw->static_data->survey_name = LAMP::decrypt($raw->static_data->survey_name, true);
			if (isset($raw->static_data->drawn_fig_file_name))
				$raw->static_data->drawn_fig_file_name = DEPLOY_ROOT . '/Games/User3DFigures/' . LAMP::decrypt($raw->static_data->drawn_fig_file_name, true);
			if (isset($raw->static_data->total_jewels_collected))
				$raw->static_data->total_jewels_collected = LAMP::decrypt($raw->static_data->total_jewels_collected, true);
			if (isset($raw->static_data->total_bonus_collected))
				$raw->static_data->total_bonus_collected = LAMP::decrypt($raw->static_data->total_bonus_collected, true);
			if (isset($raw->static_data->score))
				$raw->static_data->score = LAMP::decrypt($raw->static_data->score, true);

			// Special treatment for surveys with encrypted answers.
			if ($ctid === 1 /* survey */) {
				foreach (($raw->temporal_events ?: []) as &$x) {
					$x->item = LAMP::decrypt($x->item, true);
					$x->value = LAMP::decrypt($x->value, true);

					// Adjust the Likert scaled values to numbers.
					if (in_array($x->value, ["Not at all", "12:00AM - 06:00AM", "0-3"])) {
						$x->value = 0;
					} else if (in_array($x->value, ["Several Times", "06:00AM - 12:00PM", "3-6"])) {
						$x->value = 1;
					} else if (in_array($x->value, ["More than Half the Time", "12:00PM - 06:00PM", "6-9"])) {
						$x->value = 2;
					} else if (in_array($x->value, ["Nearly All the Time", "06:00PM - 12:00AM", ">9"])) {
						$x->value = 3;
					}
				}
			}
			return $raw;
		}, $result);
	}

    /** 
     * Add a new `ResultEvent` with new fields.
     */
    private static function _insert(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id,

        /**
         * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
         */
        $activity_id,

        /**
         * The new object to append.
         */
        $new_object
    ) {
	    // Collect the set of legacy Activity tables and stitch the full query.
	    $tableset = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");
	    $tablerow = array_filter($tableset, function ($x) use ($activity_id) {
		    return $x['ActivityIndexID'] === $activity_id;
	    })[0];

	    // First consume the timestamp + duration fields that are always present.
	    // TODO: convert time!
	    $columns = [];
	    $columns[$tablerow['StartTimeColumnName']] = $new_object->static_data->timestamp;
	    $columns[$tablerow['EndTimeColumnName']] = $new_object->static_data->timestamp + $new_object->static_data->duration;

	    // We only support 5 static slots; check if they're used by the activity first.
	    foreach ([1, 2, 3, 4, 5] as $x) {
		    if ($tablerow['Slot' . $x . 'Name'] !== null) {
		    	$sql_name = $tablerow['Slot' . $x . 'ColumnName'];
		    	$obj_name = $tablerow['Slot' . $x . 'Name'];
			    $columns[$sql_name] = $new_object->static_data->{$obj_name};
		    }
	    }

	    // Convert the static array into SQL strings.
	    $static_keys = implode(', ', array_keys($columns));
	    $static_values = implode(', ', array_values($columns));

	    // Insert row, returning the generated primary key ID.
	    $result = self::lookup("
            INSERT INTO {$tablerow['TableName']} (
                {$static_keys}
            )
            OUTPUT INSERTED.{$tablerow['IndexColumnName']} AS id
			VALUES (
		        {$static_values}
			);
        ");

	    // Bail early if there was a failure to record the parent event row.
	    if (!result) return null;
	    if ($tablerow['TemporalTableName'] === null) return $result;

	    // Now the temporal fields are mapped for each sub-event.
	    $temporals = array_map(function ($event) use($result, $tablerow) {
		    return [
			    $tablerow['TemporalIndexColumnName'] => $result['id'],
			    $tablerow['Temporal1ColumnName'] => $event->item,
			    $tablerow['Temporal2ColumnName'] => $event->value,
			    $tablerow['Temporal3ColumnName'] => $event->type,
			    $tablerow['Temporal4ColumnName'] => $event->duration,
			    $tablerow['Temporal5ColumnName'] => $event->level,
		    ];
	    }, $new_object->temporal_events);

	    // Convert the  temporal arrays into SQL strings.
	    $temporal_keys = '(' . implode(', ', array_keys($temporals[0])) . ')';
	    $temporal_values =  implode(', ', array_map(function($x) {
		    return '(' . implode(', ', array_values($x)) . ')';
	    }, $temporals));

	    // Insert sub-rows, without returning anything.
	    $result2 = self::lookup("
            INSERT INTO {$tablerow['TemporalTableName']} {$temporal_keys}
			VALUES {$temporal_values};
        ");

	    // Return the new parent row's ID.
	    return $result2 ? $result : null;
    }

	/**
	 * Update a `ResultEvent` with new fields.
	 */
	private static function _update(

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The `CTestID` column of the `CTest` table or the `SurveyID` column of
		 * the `Survey` table in the LAMP v0.1 DB.
		 */
		$type_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {
		return null; // FIXME

		// Collect the set of legacy Activity tables and stitch the full query.
		$tableset = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");
		$tablerow = array_filter($tableset, function ($x) use ($activity_id) {
			return $x['ActivityIndexID'] === $activity_id;
		})[0];

		// Insert row, returning the generated primary key ID.
		$result = self::lookup("
            UPDATE NULL SET NULL WHERE NULL = NULL; 
        ");

		// Return whether the operation was successful.
		return $result;
	}

	/**
	 * Deletes a `ResultEvent` row.
	 */
	private static function _delete(

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The `CTestID` column of the `CTest` table or the `SurveyID` column of
		 * the `Survey` table in the LAMP v0.1 DB.
		 */
		$type_id
	) {
		// Collect the set of legacy Activity tables and stitch the full query.
		$tableset = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");
		$tablerow = array_filter($tableset, function ($x) use ($activity_id) {
			return $x['ActivityIndexID'] === $activity_id;
		})[0];

		// Set the deletion flag, without actually deleting the row.
		// TODO: Deletion is not supported! CreatedOn is not correctly used here.
		$result = self::perform("
            UPDATE {$tablerow['TableName']} SET CreatedOn = NULL WHERE {$tablerow['IndexColumnName']} = {$type_id};
        ");

		// Return whether the operation was successful.
		return $result;
	}
}
