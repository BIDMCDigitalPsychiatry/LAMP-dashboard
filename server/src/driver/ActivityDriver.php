<?php
require_once __DIR__ . '/TypeDriver.php';


//
// Schedule:
//      - Slot
//          - SlotName, IsDefault
//      - Repeat
//          - RepeatInterval, IsDefault, SortOrder, IsDeleted
//      - Admin_CTestSchedule, Admin_SurveySchedule
//          - AdminID, CTestID/SurveyID, Version*(C), ScheduleDate, SlotID, Time, RepeatID, IsDeleted
//      - Admin_CTestScheduleCustomTime, Admin_SurveyScheduleCustomTime, Admin_BatchScheduleCustomTime
//          - Time
//      - Admin_BatchSchedule
//          - AdminID, BatchName, ScheduleDate, SlotID, Time, RepeatID, IsDeleted
//      - Admin_BatchScheduleCTest, Admin_BatchScheduleSurvey
//          - CTestID/SurveyID, Version*(C), Order
//
// Settings:
//      - Admin_CTestSurveySettings
//          - AdminID, CTestID, SurveyID
//      - Admin_JewelsTrailsASettings, Admin_JewelsTrailsBSettings
//          - AdminID, ... (")
//      - SurveyQuestions
//          - SurveyID, QuestionText, AnswerType, IsDeleted
//      - SurveyQuestionsOptions
//          - QuestionID, OptionText
//


trait ActivityDriver {
	use TypeDriver;

    /**
     * Get a set of `Activity`s matching the criteria parameters.
     */
    private static function _select(

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

    	// ...
        $cond1 = $ctest_id !== null ? "AND CTest.id = '$ctest_id'" : '';
        $cond2 = $survey_id !== null ? "AND SurveyID = '$survey_id'" : '';
        $cond3 = $admin_id !== null ? "AND AdminID = '$admin_id'" : '';
        $result = self::lookup("
            WITH A(value) AS (
                SELECT 
                    AdminID AS aid,
                    ('ctest') AS type,
                    CTest.*,
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
                            AND CTest.lid = 17
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
                            AND CTest.lid = 18
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
                            AND Admin_CTestSchedule.CTestID = CTest.lid
                            AND Admin_CTestSchedule.IsDeleted = 0
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS schedule
                FROM Admin
                CROSS APPLY 
                (
                    SELECT 
                        ActivityIndexID AS id,
                        LegacyCTestID AS lid,
                        Name AS name
                    FROM LAMP_Aux.dbo.ActivityIndex
                    WHERE LegacyCTestID IS NOT NULL
                ) AS CTest
                WHERE isDeleted = 0 
                    {$cond1}
                    {$cond3}
                FOR JSON PATH, INCLUDE_NULL_VALUES, WITHOUT_ARRAY_WRAPPER
            ), B(value) AS (
                SELECT 
                    SurveyID AS id, 
                    AdminID AS aid,
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
                WHERE isDeleted = 0 
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
            if ($raw->type === 'ctest') {
                $obj->id = new TypeID([Activity::class, $raw->id, array_drop($raw, 'aid'), 0 /* SurveyID */]);
	            $obj->spec = new TypeID([ActivitySpec::class, $raw->id]);
                $obj->name = $raw->name;

                // Merge both Jewels A/B into one settings object; only one should be non-null at a time anyway.
                $obj->settings = (object)array_merge(
                	(array)(!isset($raw->settings->jewelsA) ? [] : $raw->settings->jewelsA[0]),
	                (array)(!isset($raw->settings->jewelsB) ? [] : $raw->settings->jewelsB[0])
                );
            } else if ($raw->type === 'survey') {
                $obj->id = new TypeID([Activity::class, 1 /* survey */, array_drop($raw, 'aid'), $raw->id]);
	            $obj->spec = new TypeID([ActivitySpec::class, 1 /* survey */]);
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
		// Terminate the operation if any of the required string-typed fields are not present.
		if (!is_string($insert_object->spec) || !is_string($insert_object->name))
			return null;

		// Non-Survey Activities cannot be created!
		$_specID = (new TypeID($insert_object->spec))->require([ActivitySpec::class]);
		if ($_specID->part(1) !== 1 /* survey */)
			return null;

		// ... use schedule + settings for survey config!

		return null; // TODO
	}

	/**
	 * Update an `Activity` with new fields.
	 */
	private static function _update(

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The `SurveyID` column of the `Survey` table in the LAMP v0.1 DB.
		 */
		$survey_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {

		// Terminate the operation if none of the possible string-typed fields are present.
		if (!is_string($update_object->spec) && !is_string($update_object->name) &&
			!is_array($update_object->schedule) && !is_array($update_object->settings))
			return null;
		// TODO: ActivitySpec::_jewelsMap('key', null)

		// ... use name for rename activity only
		// ... use schedule + settings for survey config!

		return null; // TODO
	}

	/**
	 * Delete an `Activity` row.
	 */
	private static function _delete(

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The `SurveyID` column of the `Survey` table in the LAMP v0.1 DB.
		 */
		$survey_id
	) {
		// Non-Survey Activities cannot be created!
		if ($activity_id !== 1 /* survey */ && $survey_id != null)
			return null;

		// Set the deletion flag, without actually deleting the row.
		$result = self::perform("
            UPDATE Survey SET IsDeleted = 1 WHERE SurveyID = {$survey_id};
        ");

		// Return whether the operation was successful.
		return $result;
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
