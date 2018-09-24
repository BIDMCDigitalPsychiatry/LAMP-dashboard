<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ParticipantDriverGET_v0_1 {
	use LAMPDriver_v0_1;

    /** 
     * Get a set of `Participant`s matching the criteria parameters.
     */
    private static function _get(

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
                return new LAMPID([FitnessEvent::class, $x->id]); 
            }, $raw->hkevents) : [];
            $obj->environment_events = isset($raw->locations) ? array_map(function($x) { 
                return new LAMPID([EnvironmentEvent::class, $x->id]); 
            }, $raw->locations) : [];
            $obj->results = [];
            $obj->metadata_events = [];
            $obj->sensor_events = [];
            return $obj;
        }, $result);
    }
}

trait ParticipantDriverSET_v0_1 {
    use LAMPDriver_v0_1;

    /** 
     * Create or update a `Participant` with new fields.
     */
    private static function _set(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id = null, 

        /** 
         * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
         */
        $admin_id = null,

        /**
         * The new object or patch fields of an object.
         */
        $update_object = null
    ) {
        if ($admin_id === null && $update_object !== null) { /* create */
            // OUTPUT INSERTED.AdminID
        } else if ($admin_id !== null && $update_object !== null) { /* update */
            //
        } else { /* delete */
            //
        }
        return null;
    }
}
