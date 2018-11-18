<?php
require_once __DIR__ . '/LAMPDriver.php';

trait FitnessEventDriver_v0_1 {
	use LAMPDriver_v0_1;

    /** 
     * Get a set of `FitnessEvent`s matching the criteria parameters.
     */
    private static function _get(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id = null, 

        /** 
         * The `AdminID` column of the `Users` table in the LAMP v0.1 DB.
         */
        $admin_id = null, 

        /** 
         * The `HKDailyValueID` column of the `HealthKit_DailyValues` table in the LAMP v0.1 DB.
         */
        $health_id = null
    ) {
        $user_id = LAMP::encrypt($user_id);
        $cond1 = $health_id !== null ? "AND HKDailyValueID = '{$health_id}'" : ''; 
        $cond2 = $user_id !== null ? "AND Users.StudyId = '{$user_id}'" : '';
        $cond3 = $admin_id !== null ? "AND Users.AdminID = '{$admin_id}'" : '';
        $result = self::lookup("
            SELECT 
                HKDailyValueID AS id, 
                (0) AS attachments, 
                DATEDIFF_BIG(MS, '1970-01-01', HealthKit_DailyValues.CreatedOn) AS [timestamp],
                (CASE 
                    WHEN LEN(Height) > 0 THEN Height ELSE NULL 
                END) AS [record.height], 
                (CASE 
                    WHEN LEN(Weight) > 0 THEN Weight ELSE NULL
                END) AS [record.weight], 
                (CASE 
                    WHEN LEN(HeartRate) > 0 THEN HeartRate ELSE NULL 
                END) AS [record.heart_rate], 
                (CASE 
                    WHEN LEN(BloodPressure) > 0 THEN BloodPressure ELSE NULL 
                END) AS [record.blood_pressure], 
                (CASE 
                    WHEN LEN(RespiratoryRate) > 0 THEN RespiratoryRate ELSE NULL 
                END) AS [record.respiratory_rate], 
                (CASE 
                    WHEN LEN(Sleep) > 0 THEN Sleep ELSE NULL 
                END) AS [record.sleep], 
                (CASE 
                    WHEN LEN(Steps) > 0 THEN Steps ELSE NULL 
                END) AS [record.steps], 
                (CASE 
                    WHEN LEN(FlightClimbed) > 0 THEN FlightClimbed ELSE NULL 
                END) AS [record.flights], 
                (CASE 
                    WHEN LEN(Segment) > 0 THEN Segment ELSE NULL 
                END) AS [record.segment], 
                (CASE 
                    WHEN LEN(Distance) > 0 THEN Distance ELSE NULL 
                END) AS [record.distance]
            FROM HealthKit_DailyValues
            LEFT JOIN Users
                ON HealthKit_DailyValues.UserID = Users.UserID
            WHERE IsDeleted = 0 
                {$cond1} 
                {$cond2} 
                {$cond3}
            FOR JSON PATH;
        ", true);
        if (count($result) == 0) 
            return null;
        
        $_decrypt = function($str) {
            $v = LAMP::decrypt($str);
            return ($v == '' || $v == 'NA') ? null : strtolower($v);
        };
        $_convert = function($x, $strip_suffix, $conversion_func = 'strval') {
            return $x === null ? null : $conversion_func(str_replace($strip_suffix, '', $x));
        };
        $_clean = function($x) { return $x === 0 ? null : $x; };

        // Map from SQL DB to the local FitnessEvent type.
        foreach ($result as &$obj) {
            $obj->id = new TypeID([FitnessEvent::class, $obj->id]);
            $obj->attachments = null;
            if (isset($obj->record->height))
                $obj->record->height = $_convert($_decrypt($obj->record->height), ' cm', 'floatval');
            if (isset($obj->record->weight))
                $obj->record->weight = $_convert($_decrypt($obj->record->weight), ' kg', 'floatval');
            if (isset($obj->record->heart_rate))
                $obj->record->heart_rate = $_convert($_decrypt($obj->record->heart_rate), ' bpm', 'floatval');
            if (isset($obj->record->blood_pressure))
                $obj->record->blood_pressure = $_convert($_decrypt($obj->record->blood_pressure), ' mmhg');
            if (isset($obj->record->respiratory_rate))
                $obj->record->respiratory_rate = $_convert($_decrypt($obj->record->respiratory_rate), ' breaths/min', 'intval');
            if (isset($obj->record->sleep))
                $obj->record->sleep = $_decrypt($obj->record->sleep);
            if (isset($obj->record->steps))
                $obj->record->steps = $_clean($_convert($_decrypt($obj->record->steps), ' steps', 'intval'));
            if (isset($obj->record->flights))
                $obj->record->flights = $_clean($_convert($_decrypt($obj->record->flights), ' steps', 'intval'));
            if (isset($obj->record->segment))
                $obj->record->segment = $_convert($_decrypt($obj->record->segment), '', 'intval');
            if (isset($obj->record->distance))
                $obj->record->distance = $_convert($_decrypt($obj->record->distance), ' meters', 'floatval');

            // Clean up record entries into samples.
            if (isset($obj->record)) {
                $r = array_filter((array)$obj->record);
                $obj->record = array_map(function($key, $value) {
                    $sample = new FitnessSample();
                    $sample->type = $key;
                    $sample->value = $value;
                    return $sample;
                }, array_keys($r), $r);
            }
        }
        return $result;
    }
}

trait FitnessEventDriverSET_v0_1 {
    use LAMPDriver_v0_1;

    /** 
     * Add a new `FitnessEvent` with new fields.
     */
    private static function _add(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id,

        /**
         * The new object to append.
         */
        $new_object = null
    ) {
        // 
        // OUTPUT INSERTED.HKDailyValueID
        return null;
    }
}
