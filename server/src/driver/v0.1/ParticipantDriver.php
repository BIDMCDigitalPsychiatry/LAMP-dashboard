<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ParticipantDriver {
	use LAMPDriver_v0_1;

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
        $user_id = LAMP::encrypt($user_id);
        $cond1 = $user_id !== null ? "AND Users.StudyId = '{$user_id}'" : '';
        $cond2 = $admin_id !== null ? "AND Users.AdminID = '{$admin_id}'" : '';
        $result = self::lookup("
            SELECT 
                StudyId AS id, 
                StudyCode AS [settings.study_code], 
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
                (
                    SELECT DATEDIFF_BIG(MS, '1970-01-01', CONVERT(DATETIME, DateOfBirth))
                    WHERE DateOfBirth >= CONVERT(DATE, '1900-01-01')
                ) AS [settings.date_of_birth],
                (
                    SELECT Sex
                    WHERE Sex <> N'' AND Sex <> N'Not set'
                ) AS [settings.sex], 
                (
                    SELECT BloodType
                    WHERE BloodType <> N'' AND BloodType <> N'Not set'
                ) AS [settings.blood_type],
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
            FULL OUTER JOIN HealthKit_BasicInfo
                ON HealthKit_BasicInfo.UserID = Users.UserID
            FULL OUTER JOIN UserDevices
                ON UserDevices.UserID = Users.UserID
            WHERE Users.IsDeleted = 0 {$cond1} {$cond2}
            FOR JSON PATH, INCLUDE_NULL_VALUES;
        ", true);
        if (count($result) == 0) return null;

        // Map from SQL DB to the local Participant type.
        return array_map(function($raw) {
            $obj = new Participant();
            $obj->settings = $raw->settings;
            $obj->id = LAMP::decrypt($raw->id, true);
            $obj->settings->study_code = LAMP::decrypt($obj->settings->study_code, true);
            $obj->settings->theme = LAMP::decrypt($obj->settings->theme, true);
            $obj->settings->sex = LAMP::decrypt($obj->settings->sex, true);
            $obj->settings->blood_type = LAMP::decrypt($obj->settings->blood_type, true);
            $obj->fitness_events = isset($raw->hkevents) ? array_map(function($x) { 
                return new TypeID([FitnessEvent::class, $x->id]);
            }, $raw->hkevents) : [];
            $obj->environment_events = isset($raw->locations) ? array_map(function($x) { 
                return new TypeID([EnvironmentEvent::class, $x->id]);
            }, $raw->locations) : [];
            $obj->result_events = [];
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
		 * The new `settings` object.
		 */
		$insert_object
	) {
		// RESTRICTED: date_of_birth, sex, blood_type

		// Prepare the minimal SQL column changes from the provided fields.
		$insertsA = []; $insertsB = []; $insertsC = [];
		if ($insert_object->study_code !== null)
			array_push($insertsA, 'StudyCode = \'' . LAMP::encrypt($insert_object->study_code) . '\'');
		if ($insert_object->theme !== null)
			array_push($insertsB, 'AppColor = \'' . LAMP::encrypt($insert_object->theme) . '\'');
		if ($insert_object->language !== null)
			array_push($insertsB, 'Language = \'' . $insert_object->language . '\'');
		if ($insert_object->last_login !== null)
			array_push($insertsC, 'LastLoginOn = \'' . $insert_object->last_login . '\'');
		if ($insert_object->device_type !== null)
			array_push($insertsC, 'DeviceType = \'' . $insert_object->device_type . '\'');
		if ($insert_object->emergency_contact !== null)
			array_push($insertsB, '24By7ContactNo = \'' . LAMP::encrypt($insert_object->emergency_contact) . '\'');
		if ($insert_object->helpline !== null)
			array_push($insertsB, 'PersonalHelpline = \'' . LAMP::encrypt($insert_object->helpline) . '\'');
		if ($insert_object->blogs_checked_date !== null)
			array_push($insertsB, 'BlogsViewedOn = \'' . $insert_object->blogs_checked_date . '\'');
		if ($insert_object->tips_checked_date !== null)
			array_push($insertsB, 'TipsViewedOn = \'' . $insert_object->tips_checked_date . '\'');
		$insertsA = implode(', ', $insertsA);
		$insertsB = implode(', ', $insertsB);
		$insertsC = implode(', ', $insertsC);

		// Insert row, returning the generated primary key ID.
		$result = self::lookup("
            INSERT INTO Users (
                Email, 
                Password, 
                FirstName, 
                LastName, 
                CreatedOn, 
                AdminType
            )
            OUTPUT INSERTED.StudyId AS id
			VALUES (
		        '{$email}',
		        '{$password}',
		        '{$first_name}',
		        '{$last_name}',
		        GETDATE(), 
		        2
			);
        ");



		// INSERT: Users, UserSettings, UserDevices



		// Return the new row's ID.
		return $result;
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
		 * The patch fields of the `settings` object.
		 */
		$update_object
	) {
		// RESTRICTED: date_of_birth, sex, blood_type
		$user_id = LAMP::encrypt($user_id);

		// Terminate the operation if no valid string-typed fields are modified.
		if (!is_string($update_object->study_code) && !is_string($update_object->theme) &&
			!is_string($update_object->language) && !is_string($update_object->last_login) &&
			!is_string($update_object->device_type) && !is_string($update_object->emergency_contact) &&
			!is_string($update_object->helpline) && !is_string($update_object->blogs_checked_date) &&
			!is_string($update_object->tips_checked_date))
			return null;

		// Prepare the minimal SQL column changes from the provided fields.
		$updatesA = []; $updatesB = []; $updatesC = [];
		if ($update_object->study_code !== null)
			array_push($updatesA, 'StudyCode = \'' . LAMP::encrypt($update_object->study_code) . '\'');
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
		$result = self::perform("
            UPDATE Users SET {$updatesA} WHERE StudyId = {$user_id};
        ");

		// Return whether the operation was successful.
		return $result;
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
