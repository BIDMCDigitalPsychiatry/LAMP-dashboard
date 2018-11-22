<?php
require_once __DIR__ . '/TypeDriver.php';

trait ActivityDriver {
	use TypeDriver;

    /**
     * Get a set of `Activity`s matching the criteria parameters.
     */
    private static function _select(

    	/** 
    	 * The `ActivityType`s to get (currently only `game` or `survey`).
    	 */
    	$types = [], 

    	/** 
    	 * The `CTestID` column of the `CTest` table in the LAMP v0.1 DB.
    	 */
    	$ctest_id = null, 

    	/** 
    	 * The `SurveyID` column of the `Survey` table in the LAMP v0.1 DB.
    	 */
    	$survey_id = null, 

    	/** 
    	 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
    	 */
    	$admin_id = null
    ) {
        if (count($types) == 0) 
        	return null;

        $cond0a = in_array('game', $types) ? '1' : '0';
        $cond0b = in_array('survey', $types) ? '1' : '0';
        $cond1 = $ctest_id !== null ? "AND CTest.id = '$ctest_id'" : '';
        $cond2 = $survey_id !== null ? "AND SurveyID = '$survey_id'" : '';
        $cond3 = $admin_id !== null ? "AND AdminID = '$admin_id'" : '';
        $result = self::lookup("
            WITH A(value) AS (
                SELECT 
                    AdminID AS aid,
                    ('game') AS type,
                    CTest.*,
                    JSON_QUERY(dbo.UNWRAP_JSON((
                        SELECT 
                            SurveyID AS sid
                        FROM Admin_CTestSurveySettings
                        WHERE Admin_CTestSurveySettings.AdminID = Admin.AdminID
                            AND Admin_CTestSurveySettings.CTestID = CTest.id
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ), 'sid')) AS [settings.distraction_activities],
                    (
                        SELECT 
                            NoOfSeconds_Beg AS beginner_seconds,
                            NoOfSeconds_Int AS intermediate_seconds,
                            NoOfSeconds_Adv AS advanced_seconds,
                            NoOfSeconds_Exp AS expert_seconds,
                            NoOfDiamonds AS diamond_count,
                            NoOfShapes AS shape_count,
                            NoOfBonusPoints AS bonus_point_count,
                            X_NoOfChangesInLevel AS x_changes_in_level_count,
                            X_NoOfDiamonds AS x_diamond_count,
                            Y_NoOfChangesInLevel AS y_changes_in_level_count,
                            Y_NoOfShapes AS y_shape_count
                        FROM Admin_JewelsTrailsASettings
                        WHERE Admin_JewelsTrailsASettings.AdminID = Admin.AdminID
                            AND CTest.id = 17
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS [settings.jewelsA],
                    (
                        SELECT
                            NoOfSeconds_Beg AS beginner_seconds,
                            NoOfSeconds_Int AS intermediate_seconds,
                            NoOfSeconds_Adv AS advanced_seconds,
                            NoOfSeconds_Exp AS expert_seconds,
                            NoOfDiamonds AS diamond_count,
                            NoOfShapes AS shape_count,
                            NoOfBonusPoints AS bonus_point_count,
                            X_NoOfChangesInLevel AS x_changes_in_level_count,
                            X_NoOfDiamonds AS x_diamond_count,
                            Y_NoOfChangesInLevel AS y_changes_in_level_count,
                            Y_NoOfShapes AS y_shape_count
                        FROM Admin_JewelsTrailsBSettings
                        WHERE Admin_JewelsTrailsBSettings.AdminID = Admin.AdminID
                            AND CTest.id = 18
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS [settings.jewelsB],
                    (
                        SELECT
                            Version as version,
                            ScheduleDate as schedule_date,
                            Time as time,
                            RepeatID as repeat_interval,
                            JSON_QUERY(dbo.UNWRAP_JSON((
                                SELECT 
                                    Time AS t
                                FROM Admin_CTestScheduleCustomTime
                                WHERE Admin_CTestScheduleCustomTime.AdminCTestSchId = Admin_CTestSchedule.AdminCTestSchId
                                FOR JSON PATH, INCLUDE_NULL_VALUES
                            ), 't')) AS custom_time
                        FROM Admin_CTestSchedule
                        WHERE Admin_CTestSchedule.AdminID = Admin.AdminID
                            AND Admin_CTestSchedule.CTestID = CTest.id
                            AND Admin_CTestSchedule.IsDeleted = 0
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS schedule
                FROM Admin
                CROSS APPLY 
                (
                    SELECT 
                        CTestID AS id,
                        CTestName AS name,
                        MaxVersions AS [settings.max_versions]
                    FROM CTest
                    WHERE IsDeleted = 0
                ) AS CTest
                WHERE 1={$cond0a} 
                    AND isDeleted = 0 
                    {$cond1}
                    {$cond3}
                FOR JSON PATH, INCLUDE_NULL_VALUES, WITHOUT_ARRAY_WRAPPER
            ), B(value) AS (
                SELECT 
                    SurveyID AS id, 
                    SurveyName AS name, 
                    ('survey') AS type,
                    (
                        SELECT 
                            QuestionText AS text, 
                            CHOOSE(AnswerType, 
                                'likert', 'list', 'boolean', 'clock', 'years', 'months', 'days'
                            ) AS type, 
                            JSON_QUERY(dbo.UNWRAP_JSON((
                                SELECT 
                                    OptionText AS opt
                                FROM SurveyQuestionOptions
                                WHERE SurveyQuestionOptions.QuestionID = SurveyQuestions.QuestionID
                                FOR JSON PATH, INCLUDE_NULL_VALUES
                            ), 'opt')) AS options
                            FROM SurveyQuestions
                            WHERE IsDeleted = 0 
                                AND SurveyQuestions.SurveyID = Survey.SurveyID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS questions,
                    (
                        SELECT
                            ScheduleDate as schedule_date,
                            Time as time,
                            RepeatID as repeat_interval,
                            JSON_QUERY(dbo.UNWRAP_JSON((
                                SELECT 
                                    Time AS t
                                FROM Admin_SurveyScheduleCustomTime
                                WHERE Admin_SurveyScheduleCustomTime.AdminSurveySchId = Admin_SurveySchedule.AdminSurveySchId
                                FOR JSON PATH, INCLUDE_NULL_VALUES
                            ), 't')) AS custom_time
                        FROM Admin_SurveySchedule
                        WHERE Admin_SurveySchedule.SurveyID = Survey.SurveyID
                            AND Admin_SurveySchedule.IsDeleted = 0
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS schedule
                FROM Survey
                WHERE 1={$cond0b} 
                    AND isDeleted = 0 
                    {$cond2}
                    {$cond3}
                FOR JSON PATH, INCLUDE_NULL_VALUES, WITHOUT_ARRAY_WRAPPER
            )
            SELECT CONCAT('[', A.value, CASE 
                WHEN LEN(A.value) > 0 AND LEN(B.value) > 0 THEN ',' ELSE '' 
            END, B.value, ']')
            FROM A, B;
        ", true);
        if (count($result) == 0)
        	return null;

        //
        return array_map(function($raw) { 
            $obj = new Activity();
            $obj->type = $raw->type;
            if ($obj->type == ActivityType::Game) {
                $obj->id = new TypeID([Activity::class, ActivityType::Game, $raw->id,
                                       array_drop($raw, 'aid')]);
                $obj->name = $raw->name;
                $obj->settings = $raw->settings;
                if (isset($obj->settings->distraction_activities))
                    $obj->settings->distraction_activities = array_map(function($x) { 
                        return new TypeID([Activity::class, ActivityType::Survey, $x]);
                    }, $obj->settings->distraction_activities);
            } else if ($obj->type == ActivityType::Survey) {
                $obj->id = new TypeID([Activity::class, ActivityType::Survey, $raw->id]);
                $obj->name = $raw->name;
                $obj->settings = $raw->questions;
            }
            $obj->schedule = isset($raw->schedule) ? array_merge(...array_map(function($x) {
                $duration = new DurationInterval(); $ri = $x->repeat_interval;
                if ($ri >= 0 && $ri <= 4) { /* hourly */
                    $h = ($ri == 4 ? 12 : ($ri == 3 ? 6 : ($ri == 2 ? 3 : 1)));
                    $duration->interval = new CalendarComponents();
                    $duration->interval->hour = $h;
                } else if ($ri >= 5 && $ri <= 10) { /* weekly+ */
                    if ($ri == 6) {
                        $duration = [
                            new DurationInterval(strtotime($x->time) * 1000, new CalendarComponents()), 
                            new DurationInterval(strtotime($x->time) * 1000, new CalendarComponents())
                        ];
                        $duration[0]->interval->weekday = 2;
                        $duration[1]->interval->weekday = 4;
                    } else if ($ri == 7) {
                        $duration = [
                            new DurationInterval(strtotime($x->time) * 1000, new CalendarComponents()), 
                            new DurationInterval(strtotime($x->time) * 1000, new CalendarComponents()), 
                            new DurationInterval(strtotime($x->time) * 1000, new CalendarComponents())
                        ];
                        $duration[0]->interval->weekday = 1;
                        $duration[1]->interval->weekday = 3;
                        $duration[2]->interval->weekday = 5;
                    } else {
                        $duration = [
                            new DurationInterval(strtotime($x->time) * 1000, new CalendarComponents())
                        ];
                        $duration[0]->interval->day = ($ri == 5 ? 1 : null);
                        $duration[0]->interval->week_of_month = ($ri == 9 ? 2 : ($ri == 8 ? 1 : null));
                        $duration[0]->interval->month = ($ri == 10 ? 1 : null);
                    }
                } else if ($ri == 11 && count($x->custom_time) == 1) { /* custom+ */
                    $duration->start = strtotime($x->custom_time[0]) * 1000;
                    $duration->repeat_count = 1;
                } else if ($ri == 11 && count($x->custom_time) > 2) { /* custom* */
                    $int_comp = (new DateTime($x->custom_time[0]))
                                    ->diff(new DateTime($x->custom_time[1]));
                    $duration->start = strtotime($x->custom_time[0]) * 1000;
                    $duration->interval = new CalendarComponents();
                    $duration->interval->year = ($int_comp->y == 0 ? null : $int_comp->y);
                    $duration->interval->month = ($int_comp->m == 0 ? null : $int_comp->m);
                    $duration->interval->day = ($int_comp->d == 0 ? null : $int_comp->d);
                    $duration->interval->hour = ($int_comp->h == 0 ? null : $int_comp->h);
                    $duration->interval->minute = ($int_comp->i == 0 ? null : $int_comp->i);
                    $duration->interval->second = ($int_comp->s == 0 ? null : $int_comp->s);
                    $duration->repeat_count = count($x->custom_time) - 1;
                } else if ($ri == 12) { /* none */
                    $duration->start = strtotime($x->time) * 1000;
                    $duration->repeat_count = 1;
                }
                return is_array($duration) ? $duration : [$duration];
            }, $raw->schedule)) : null;
            return $obj;
        }, $result);
    }

	/**
	 * Create an `Activity` with a new object.
	 */
	private static function _insert(

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The new object.
		 */
		$insert_object
	) {
		// TODO: Activities cannot be created!
		return null; // TODO
	}

	/**
	 * Update an `Activity` with new fields.
	 */
	private static function _update(

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {

		// TODO: update surveys!
		// TODO: update ctests!

		// 1. lookup activity_id -> settings info
		// 2. settings info -> table name, slot map (!!!)
		// 3. update <table name> set <slots*> = <values*> where <admin_id>

		// -> settings.jewelsA or settings.jewelsB:

		// The column map specifies the LAMP object key to DB row column mapping.
		static $jewels_settings_column_map = [
			"beginner_seconds" => "NoOfSeconds_Beg",
			"intermediate_seconds" => "NoOfSeconds_Int",
			"advanced_seconds" => "NoOfSeconds_Adv",
			"expert_seconds" => "NoOfSeconds_Exp",
			"diamond_count" => "NoOfDiamonds",
			"shape_count" => "NoOfShapes",
			"bonus_point_count" => "NoOfBonusPoints",
			"x_changes_in_level_count" => "X_NoOfChangesInLevel",
			"x_diamond_count" => "X_NoOfDiamonds",
			"y_changes_in_level_count" => "Y_NoOfChangesInLevel",
			"y_shape_count" => "Y_NoOfShapes",
		];

		// The default map specifies the LAMP object's value if none is found.
		static $jewels_settings_default_map = [
			"beginner_seconds" => 0,
			"intermediate_seconds" => 0,
			"advanced_seconds" => 0,
			"expert_seconds" => 0,
			"diamond_count" => 0,
			"shape_count" => 0,
			"bonus_point_count" => 0,
			"x_changes_in_level_count" => 0,
			"x_diamond_count" => 0,
			"y_changes_in_level_count" => 0,
			"y_shape_count" => 0,
		];



		// questions



		// -> schedule
		//      -> schedule_date
		//      -> time
		//      -> repeat_interval
		//      -> custom_time
		//          -> t



		return null;
	}

	/**
	 * Delete an `Activity` row.
	 */
	private static function _delete(

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id
	) {
		// TODO: Activities cannot be deleted!
		return null; // TODO
	}
}

/*
-- Utility function that removes keys from FOR JSON output.
-- i.e. UNWRAP_JSON([{'val':1,{'val':2},{'val':'cell'}], 'val') => [1,2,'cell']
CREATE OR ALTER FUNCTION FUNCTION
    dbo.UNWRAP_JSON(@json nvarchar(max), @key nvarchar(400)) RETURNS nvarchar(max)
AS BEGIN
    RETURN REPLACE(REPLACE(@json, FORMATMESSAGE('{"%s":', @key),''), '}','')
END;
*/
