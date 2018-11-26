<?php
require_once __DIR__ . '/TypeDriver.php';

trait ParticipantDriver {
	use TypeDriver;

    /** 
     * Get a set of `Participant`s matching the criteria parameters.
     */
    private static function _select(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id = null, 

        /** 
         * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
         */
        $admin_id = null
    ) {

	    // Collect the set of legacy Activity tables and stitch the full query.
	    $activities_list = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");

	    // Construct N sub-objects for each of N activities.
	    $results_list = implode('', array_map(function ($entry) {
		    return "
	    	    (
                    SELECT 
                        ({$entry['ActivityIndexID']}) AS ctid,
                        [{$entry['IndexColumnName']}] AS id
                    FROM {$entry['TableName']}
                    WHERE {$entry['TableName']}.UserID = Users.UserID
                    FOR JSON PATH, INCLUDE_NULL_VALUES
                ) AS [rst_grp_{$entry['ActivityIndexID']}],
	    	";
	    }, $activities_list));

	    // Configure lookup conditions (by user or admin only).
        $user_id = LAMP::encrypt($user_id);
        $cond1 = $user_id !== null ? "AND Users.StudyId = '{$user_id}'" : '';
        $cond2 = $admin_id !== null ? "AND Users.AdminID = '{$admin_id}'" : '';

        // Perform complex lookup, returning a JSON object set.
        $result = self::lookup("
            SELECT 
                StudyId AS id, 
                StudyCode AS study_code, 
                AppColor AS [settings.theme], 
                Language AS [settings.language], 
                DATEDIFF_BIG(MS, '1970-01-01', LastLoginOn) AS [settings.last_login],
                (CASE 
                    WHEN DeviceType = 1 THEN 'iOS'
                    WHEN DeviceType = 2 THEN 'Android'
                    ELSE NULL
                END) AS [settings.device_type],
                (
                    SELECT [24By7ContactNo]
                    WHERE [24By7ContactNo] != ''
                ) AS [settings.emergency_contact],
                (
                    SELECT PersonalHelpline
                    WHERE PersonalHelpline != ''
                ) AS [settings.helpline], 
                (
                    SELECT DATEDIFF_BIG(MS, '1970-01-01', BlogsViewedOn)
                    WHERE BlogsViewedOn IS NOT NULL
                ) AS [settings.blogs_checked_date],
                (
                    SELECT DATEDIFF_BIG(MS, '1970-01-01', TipsViewedOn)
                    WHERE TipsViewedOn IS NOT NULL
                ) AS [settings.tips_checked_date],
                {$results_list}
                (
                    SELECT HKDailyValueID AS id
                    FROM HealthKit_DailyValues
                    WHERE HealthKit_DailyValues.UserID = Users.UserID
                    FOR JSON PATH, INCLUDE_NULL_VALUES
                ) AS hkevents,
                (
                    SELECT LocationID AS id
                    FROM Locations
                    WHERE Locations.UserID = Users.UserID
                    FOR JSON PATH, INCLUDE_NULL_VALUES
                ) AS locations
            FROM Users
            FULL OUTER JOIN UserSettings
                ON UserSettings.UserID = Users.UserID
            FULL OUTER JOIN UserDevices
                ON UserDevices.UserID = Users.UserID
            WHERE Users.IsDeleted = 0 {$cond1} {$cond2}
            FOR JSON PATH, INCLUDE_NULL_VALUES;
        ", true);
        if (count($result) == 0) return null;

        // Map from SQL DB to the local Participant type.
        return array_map(function($raw) use($activities_list) {

	        // A weird reverse-map + array-splat to group all result rows together.
	        $rst_grp_all = array_merge(...array_map(function ($entry) use ($raw) {
	        	// FIXME: SurveyID is missing!
	        	$key = 'rst_grp_' . $entry['ActivityIndexID'];
		        return isset($raw->{$key}) ? $raw->{$key} : [];
	        }, $activities_list));

	        // Create a new Participant object for type-checking and other facilities.
            $obj = new Participant();
            $obj->settings = $raw->settings;
            $obj->id = LAMP::decrypt($raw->id, true);
            $obj->study_code = LAMP::decrypt($raw->study_code, true);
            $obj->settings->theme = LAMP::decrypt($obj->settings->theme, true);
            $obj->fitness_events = isset($raw->hkevents) ? array_map(function($x) {
                return new TypeID([FitnessEvent::class, $x->id]);
            }, $raw->hkevents) : [];
            $obj->environment_events = isset($raw->locations) ? array_map(function($x) {
                return new TypeID([EnvironmentEvent::class, $x->id]);
            }, $raw->locations) : [];
	        $obj->result_events = array_map(function ($x) {
		        return new TypeID([ResultEvent::class, $x->ctid, $x->id]);
            }, $rst_grp_all);
            $obj->metadata_events = [];
            $obj->sensor_events = [];
            return $obj;
        }, $result);
    }

	/**
	 * Create a `Participant`.
	 */
	private static function _insert(

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The patch fields of the `Participant` object. Only `settings` and `password` are supported.
		 */
		$insert_object
	) {
		$insert_password = $insert_object->password;
		$insert_code = $insert_object->study_code;
		$insert_object = $insert_object->settings;

		// Terminate the operation if any of the required valid string-typed fields are not present.
		if (!is_string($insert_password))
			return null;

		// Create a fake email and study ID to allow login on the client app.
		$_id = 'U' . rand(000000, 999999);
		$study_id = LAMP::encrypt($_id);
		$email = LAMP::encrypt(bin2hex(openssl_random_pseudo_bytes(6)) . '@lamp.com');

		// Prepare the likely required SQL column changes as above.
		$password = LAMP::encrypt($insert_password, null, 'oauth');
		$study_code = isset($insert_code) ? LAMP::encrypt($insert_code) : 'NULL';

		// Prepare the minimal SQL column changes from the provided fields.
		$theme = isset($insert_object->theme) ? LAMP::encrypt($insert_object->theme) : 'NULL';
		$language = isset($insert_object->language) ? $insert_object->language : 'NULL';
		$emergency_contact = isset($insert_object->emergency_contact) ? LAMP::encrypt($insert_object->emergency_contact) : 'NULL';
		$helpline = isset($insert_object->helpline) ? LAMP::encrypt($insert_object->helpline) : 'NULL';
		$blogs_checked_date = isset($insert_object->blogs_checked_date) ? $insert_object->blogs_checked_date : 'NULL';
		$tips_checked_date = isset($insert_object->tips_checked_date) ? $insert_object->tips_checked_date : 'NULL';
		// Part Two: Devices!
		$last_login = isset($insert_object->last_login) ? $insert_object->last_login : 'NULL';
		$device_type = isset($insert_object->device_type) ? $insert_object->device_type : 'NULL';

		// Insert row, returning the generated primary key ID.
		$result1 = self::lookup("
            INSERT INTO Users (
                Email, 
                Password, 
                StudyCode, 
                StudyId, 
                CreatedOn, 
                AdminID
            )
            OUTPUT INSERTED.UserID AS id
			VALUES (
		        '{$email}',
		        '{$password}',
		        '{$study_code}',
		        '{$study_id}',
		        GETDATE(), 
		        {$admin_id}
			);
        ");

		// Bail early if we failed to create a User row.
		if (!$result1) return null;

		$result2 = self::lookup("
            INSERT INTO UserSettings (
                UserID, 
                AppColor, 
                [24By7ContactNo], 
                PersonalHelpline,
                BlogsViewedOn, 
                TipsViewedOn, 
                Language
            )
			VALUES (
			    {$result1['id']},
		        '{$theme}',
		        '{$emergency_contact}',
		        '{$helpline}',
		        '{$blogs_checked_date}',
		        '{$tips_checked_date}', 
		        '{$language}'
			);
        ");
		$result3 = self::lookup("
            INSERT INTO UserDevices (
                UserID, 
                DeviceType, 
                LastLoginOn
            )
			VALUES (
			    {$result1['id']},
		        '{$device_type}'
		        '{$last_login}',
			);
        ");

		// Return the new row's ID.
		return ($result1 && $result2 && $result3) ? ['id' => $_id] : null;
	}

	/**
	 * Update a `Participant` with new fields.
	 */
	private static function _update(

		/**
		 * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
		 */
		$user_id,

		/**
		 * The patch fields of the `Participant` object. Only `settings` and `password` are supported.
		 */
		$update_object
	) {
		$update_password = $update_object->password;
		$update_code = $update_object->study_code;
		$update_object = $update_object->settings;
		$user_id = LAMP::encrypt($user_id);

		// Terminate the operation if no valid string-typed fields are modified.
		if (!is_string($update_code) && !is_string($update_object->theme) &&
			!is_string($update_object->language) && !is_string($update_object->last_login) &&
			!is_string($update_object->device_type) && !is_string($update_object->emergency_contact) &&
			!is_string($update_object->helpline) && !is_string($update_object->blogs_checked_date) &&
			!is_string($update_object->tips_checked_date) && !is_string($update_password))
			return null;

		// Prepare the minimal SQL column changes from the provided fields.
		$updatesA = []; $updatesB = []; $updatesC = [];
		if ($update_password !== null)
			array_push($updatesA, 'Password = \'' . LAMP::encrypt($update_password, null, 'oauth') . '\'');
		if ($update_code !== null)
			array_push($updatesA, 'StudyCode = \'' . LAMP::encrypt($update_code) . '\'');
		if ($update_object->theme !== null)
			array_push($updatesB, 'AppColor = \'' . LAMP::encrypt($update_object->theme) . '\'');
		if ($update_object->language !== null)
			array_push($updatesB, 'Language = \'' . $update_object->language . '\'');
		if ($update_object->last_login !== null)
			array_push($updatesC, 'LastLoginOn = \'' . $update_object->last_login . '\'');
		if ($update_object->device_type !== null)
			array_push($updatesC, 'DeviceType = \'' . $update_object->device_type . '\'');
		if ($update_object->emergency_contact !== null)
			array_push($updatesB, '24By7ContactNo = \'' . LAMP::encrypt($update_object->emergency_contact) . '\'');
		if ($update_object->helpline !== null)
			array_push($updatesB, 'PersonalHelpline = \'' . LAMP::encrypt($update_object->helpline) . '\'');
		if ($update_object->blogs_checked_date !== null)
			array_push($updatesB, 'BlogsViewedOn = \'' . $update_object->blogs_checked_date . '\'');
		if ($update_object->tips_checked_date !== null)
			array_push($updatesB, 'TipsViewedOn = \'' . $update_object->tips_checked_date . '\'');
		$updatesA = implode(', ', $updatesA);
		$updatesB = implode(', ', $updatesB);
		$updatesC = implode(', ', $updatesC);

		// Update the specified fields on the selected Users, UserSettings, or UserDevices row.
		$result1 = self::perform("
            UPDATE Users 
            SET {$updatesA} 
            WHERE StudyId = {$user_id};
        ");
		$result2 = self::perform("
            UPDATE UserSettings 
            SET {$updatesB} 
            LEFT JOIN Users ON Users.UserID = UserSettings.UserID 
            WHERE StudyId = {$user_id};
        ");
		$result3 = self::perform("
            UPDATE UserDevices 
            SET {$updatesC} 
            LEFT JOIN Users ON Users.UserID = UserDevices.UserID
            WHERE StudyId = {$user_id};
        ");

		// Return whether the operation was successful.
		return ($result1 && $result2 && $result3);
	}

	/**
	 * Delete a `Participant`.
	 */
	private static function _delete(

		/**
		 * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
		 */
		$user_id
	) {
		$user_id = LAMP::encrypt($user_id);

		// Set the deletion flag, without actually deleting the row.
		$result = self::perform("
            UPDATE Users SET IsDeleted = 1 WHERE StudyId = {$user_id};
        ");

		// Return whether the operation was successful.
		return $result;
	}
}
