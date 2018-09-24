<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ResultDriverGET_v0_1 {
	use LAMPDriver_v0_1;

    /** 
     * Get a set of `Result`s matching the criteria parameters.
     */
    private static function _get(

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
        $result = self::lookup("
            WITH Surveys(value) AS (
                SELECT 
                    (-1) AS ctid,
                    SurveyResultID AS id,
                    SurveyResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    SurveyName AS [static_data.survey_name],
                    (
                        SELECT 
                            Question AS item,
                            CorrectAnswer AS value,
                            LOWER(ClickRange) AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            (NULL) AS level
                        FROM SurveyResultDtl
                        WHERE SurveyResult.SurveyResultID = SurveyResultDtl.SurveyResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM SurveyResult
                LEFT JOIN Users
                    ON SurveyResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), NBack(value) AS (
                SELECT 
                    (1) AS ctid,
                    NBackResultID AS id,
                    CTest_NBackResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    TotalQuestions AS [static_data.total_questions],
                    Version AS [static_data.version],
                    (NULL) AS temporal_events
                FROM CTest_NBackResult
                LEFT JOIN Users
                    ON CTest_NBackResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), TrailsB(value) AS (
                SELECT 
                    (2) AS ctid,
                    TrailsBResultID AS id,
                    CTest_TrailsBResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    (
                        SELECT 
                            Alphabet AS item,
                            (NULL) AS value,
                            Status AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            Sequence AS level
                        FROM CTest_TrailsBResultDtl
                        WHERE CTest_TrailsBResult.TrailsBResultID = CTest_TrailsBResultDtl.TrailsBResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM CTest_TrailsBResult
                LEFT JOIN Users
                    ON CTest_TrailsBResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), Spatial(value) AS (
                SELECT 
                    (CASE WHEN Type = 2 THEN 4 ELSE 3 END) AS ctid,
                    SpatialResultID AS id,
                    CTest_SpatialResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    (
                        SELECT 
                            GameIndex AS item,
                            Sequence AS value,
                            Status AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            Level AS level
                        FROM CTest_SpatialResultDtl
                        WHERE CTest_SpatialResult.SpatialResultID = CTest_SpatialResultDtl.SpatialResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM CTest_SpatialResult
                LEFT JOIN Users
                    ON CTest_SpatialResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), SimpleMemory(value) AS (
                SELECT 
                    (5) AS ctid,
                    SimpleMemoryResultID AS id,
                    CTest_SimpleMemoryResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    TotalQuestions AS [static_data.total_questions],
                    Version AS [static_data.version],
                    (NULL) AS temporal_events
                FROM CTest_SimpleMemoryResult
                LEFT JOIN Users
                    ON CTest_SimpleMemoryResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), Serial7(value) AS (
                SELECT 
                    (6) AS ctid,
                    Serial7ResultID AS id,
                    CTest_Serial7Result.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    TotalQuestions AS [static_data.total_questions],
                    Version AS [static_data.version],
                    (NULL) AS temporal_events
                FROM CTest_Serial7Result
                LEFT JOIN Users
                    ON CTest_Serial7Result.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), CatAndDog(value) AS (
                SELECT 
                    (7) AS ctid,
                    CatAndDogResultID AS id,
                    CTest_CatAndDogResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    TotalQuestions AS [static_data.total_questions],
                    (NULL) AS temporal_events
                FROM CTest_CatAndDogResult
                LEFT JOIN Users
                    ON CTest_CatAndDogResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), [3DFigure](value) AS (
                SELECT 
                    (8) AS ctid,
                    [3DFigureResultID] AS id,
                    CTest_3DFigureResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    FigureName AS [static_data.figure_name],
                    DrawnFigFileName AS [static_data.drawn_fig_file_name],
                    GameName AS [static_data.game_name],
                    (NULL) AS temporal_events
                FROM CTest_3DFigureResult
                LEFT JOIN Users
                    ON CTest_3DFigureResult.UserID = Users.UserID
                LEFT JOIN CTest_3DFigure
                    ON CTest_3DFigureResult.[3DFigureID] = CTest_3DFigure.[3DFigureID]
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), VisualAssociation(value) AS (
                SELECT 
                    (9) AS ctid,
                    VisualAssocResultID AS id,
                    CTest_VisualAssociationResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    TotalQuestions AS [static_data.total_questions],
                    Version AS [static_data.version],
                    (NULL) AS temporal_events
                FROM CTest_VisualAssociationResult
                LEFT JOIN Users
                    ON CTest_VisualAssociationResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), DigitSpan(value) AS (
                SELECT 
                    (CASE WHEN Type = 2 THEN 13 ELSE 10 END) AS ctid,
                    DigitSpanResultID AS id,
                    CTest_DigitSpanResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    (NULL) AS temporal_events
                FROM CTest_DigitSpanResult
                LEFT JOIN Users
                    ON CTest_DigitSpanResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), CatAndDogNew(value) AS (
                SELECT 
                    (11) AS ctid,
                    CatAndDogNewResultID AS id,
                    CTest_CatAndDogNewResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    (NULL) AS temporal_events
                FROM CTest_CatAndDogNewResult
                LEFT JOIN Users
                    ON CTest_CatAndDogNewResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), TemporalOrder(value) AS (
                SELECT 
                    (12) AS ctid,
                    TemporalOrderResultID AS id,
                    CTest_TemporalOrderResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    Version AS [static_data.version],
                    (NULL) AS temporal_events
                FROM CTest_TemporalOrderResult
                LEFT JOIN Users
                    ON CTest_TemporalOrderResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), NBackNew(value) AS (
                SELECT 
                    (14) AS ctid,
                    NBackNewResultID AS id,
                    CTest_NBackNewResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    CorrectAnswers AS [static_data.correct_answers],
                    WrongAnswers AS [static_data.wrong_answers],
                    TotalQuestions AS [static_data.total_questions],
                    (NULL) AS temporal_events
                FROM CTest_NBackNewResult
                LEFT JOIN Users
                    ON CTest_NBackNewResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), TrailsBNew(value) AS (
                SELECT 
                    (15) AS ctid,
                    TrailsBNewResultID AS id,
                    CTest_TrailsBNewResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    Version AS [static_data.version],
                    (
                        SELECT 
                            Alphabet AS item,
                            (NULL) AS value,
                            Status AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            Sequence AS level
                        FROM CTest_TrailsBNewResultDtl
                        WHERE CTest_TrailsBNewResult.TrailsBNewResultID = CTest_TrailsBNewResultDtl.TrailsBNewResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM CTest_TrailsBNewResult
                LEFT JOIN Users
                    ON CTest_TrailsBNewResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), TrailsBDotTouch(value) AS (
                SELECT 
                    (16) AS ctid,
                    TrailsBDotTouchResultID AS id,
                    CTest_TrailsBDotTouchResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    (
                        SELECT 
                            Alphabet AS item,
                            (NULL) AS value,
                            Status AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            Sequence AS level
                        FROM CTest_TrailsBDotTouchResultDtl
                        WHERE CTest_TrailsBDotTouchResult.TrailsBDotTouchResultID = CTest_TrailsBDotTouchResultDtl.TrailsBDotTouchResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM CTest_TrailsBDotTouchResult
                LEFT JOIN Users
                    ON CTest_TrailsBDotTouchResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), JewelsTrailsA(value) AS (
                SELECT 
                    (17) AS ctid,
                    JewelsTrailsAResultID AS id,
                    CTest_JewelsTrailsAResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    TotalBonusCollected AS [static_data.total_bonus_collected],
                    TotalJewelsCollected AS [static_data.total_jewels_collected],
                    (
                        SELECT 
                            Alphabet AS item,
                            (NULL) AS value,
                            Status AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            Sequence AS level
                        FROM CTest_JewelsTrailsAResultDtl
                        WHERE CTest_JewelsTrailsAResult.JewelsTrailsAResultID = CTest_JewelsTrailsAResultDtl.JewelsTrailsAResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM CTest_JewelsTrailsAResult
                LEFT JOIN Users
                    ON CTest_JewelsTrailsAResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            ), JewelsTrailsB(value) AS (
                SELECT 
                    (18) AS ctid,
                    JewelsTrailsBResultID AS id,
                    CTest_JewelsTrailsBResult.UserID AS uid,
                    Users.AdminID AS aid,
                    (NULL) AS attachments,
                    (NULL) AS activity,
                    DATEDIFF_BIG(MS, '1970-01-01', StartTime) AS start_time,
                    DATEDIFF_BIG(MS, '1970-01-01', EndTime) AS end_time,
                    Point AS [static_data.point],
                    Rating AS [static_data.rating],
                    Score AS [static_data.score],
                    TotalAttempts AS [static_data.total_attempts],
                    TotalBonusCollected AS [static_data.total_bonus_collected],
                    TotalJewelsCollected AS [static_data.total_jewels_collected],
                    (
                        SELECT 
                            Alphabet AS item,
                            (NULL) AS value,
                            Status AS type,
                            CAST(CAST(TimeTaken AS float) * 1000 AS bigint) AS elapsed_time,
                            Sequence AS level
                        FROM CTest_JewelsTrailsBResultDtl
                        WHERE CTest_JewelsTrailsBResult.JewelsTrailsBResultID = CTest_JewelsTrailsBResultDtl.JewelsTrailsBResultID
                        FOR JSON PATH, INCLUDE_NULL_VALUES
                    ) AS temporal_events
                FROM CTest_JewelsTrailsBResult
                LEFT JOIN Users
                    ON CTest_JewelsTrailsBResult.UserID = Users.UserID
                WHERE 1=1 
                    {$cond1} 
                    {$cond2}
                FOR JSON PATH, INCLUDE_NULL_VALUES
            )
            SELECT X.value FROM ( 
                SELECT value FROM Surveys UNION ALL
                SELECT value FROM NBack UNION ALL
                SELECT value FROM TrailsB UNION ALL
                SELECT value FROM Spatial UNION ALL
                SELECT value FROM SimpleMemory UNION ALL
                SELECT value FROM Serial7 UNION ALL
                SELECT value FROM CatAndDog UNION ALL
                SELECT value FROM [3DFigure] UNION ALL
                SELECT value FROM VisualAssociation UNION ALL
                SELECT value FROM DigitSpan UNION ALL
                SELECT value FROM CatAndDogNew UNION ALL
                SELECT value FROM TemporalOrder UNION ALL
                SELECT value FROM NBackNew UNION ALL
                SELECT value FROM TrailsBNew UNION ALL
                SELECT value FROM TrailsBDotTouch UNION ALL
                SELECT value FROM JewelsTrailsA UNION ALL
                SELECT value FROM JewelsTrailsB 
            ) X;
        ");

        // We need to do some pre-processing because the JSON we get from
        // SQL Server is just frankly way too massive.
        $result = array_merge(...array_map(function($x) {
            return json_decode($x['value']) ?: []; // inner JSON
        }, $result)); // unpack and flatten all sub-arrays
        if (count($result) === 0) 
            return null;
        
        // Map from SQL DB to the local Result type.
        return array_map(function($raw) {
            $id = $raw->id;
            $ctid = array_drop($raw, 'ctid');
            $uid = array_drop($raw, 'uid');
            $aid = array_drop($raw, 'aid');
            $raw->id = new LAMPID([Result::class, $id, $ctid]);
            if ($ctid >= 0)
                $raw->activity = new LAMPID([Activity::class, ActivityType::Game, $ctid, $aid]);

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
}

trait ResultDriverSET_v0_1 {
    use LAMPDriver_v0_1;

    /** 
     * Add a new `Result` with new fields.
     */
    private static function _add(

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
}
