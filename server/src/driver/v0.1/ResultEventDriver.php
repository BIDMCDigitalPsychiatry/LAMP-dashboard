<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ResultEventDriver {
	use LAMPDriver;

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
                    [{$entry['TableName']}].UserID AS uid,
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
			$id = $raw->id;
			$ctid = array_drop($raw, 'ctid');
			$uid = array_drop($raw, 'uid');
			$aid = array_drop($raw, 'aid');
			$raw->id = new TypeID([ResultEvent::class, $id, $ctid]);
			if ($ctid >= 0)
				$raw->activity = new TypeID([Activity::class, ActivityType::Game, $ctid, $aid]);

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
			if ($ctid < 0) foreach (($raw->temporal_events ?: []) as &$x) {
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
        $user_id = null, 

        /** 
         * The `ActivityType` to set (currently only `game` or `survey`).
         */
        $activity_type = null, 

        /** 
         * The `CTestID` column of the `CTest` table in the LAMP v0.1 DB.
         */
        $ctest_id = null, 

        /** 
         * The `SurveyID` column of the `Survey` table in the LAMP v0.1 DB.
         */
        $survey_id = null, 

        /**
         * The new object to append.
         */
        $new_object = null
    ) {
        // OUTPUT INSERTED.{CTest_*ResultID,SurveyResultID}
        return null;
    }

	/**
	 * Deletes a `ResultEvent` row.
	 */
	private static function _delete(

		/**
		 * The `ActivityType` to set (currently only `game` or `survey`).
		 */
		$activity_type = null,

		/**
		 * The `CTestID` column of the `CTest` table or the `SurveyID` column of
		 * the `Survey` table in the LAMP v0.1 DB.
		 */
		$type_id = null
	) {
		return null;
	}
}
