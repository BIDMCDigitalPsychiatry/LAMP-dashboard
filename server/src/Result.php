<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/ResultDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"none", "correct", "valid"}
 * )
 */
abstract class DetailType extends LAMP {
    const None = 'none';
    const Correct = 'correct';
    const Valid = 'valid';
}

/**
 * @OA\Schema()
 */
class TemporalEvent extends LAMP {

    /** 
     * @OA\Property(
     *   @OA\Schema()
     * )
     */
    public $item = null;

    /** 
     * @OA\Property(
     *   @OA\Schema()
     * )
     */
    public $value = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/DetailType"
     * )
     */
    public $type = null;

    /** 
     * @OA\Property(
     *   type="integer",
     *   format="int64",
     * )
     */
    public $elapsed_time = null;

    /** 
     * @OA\Property(
     *   type="integer",
     *   format="int64",
     * )
     */
    public $level = null;
}

/**
 * @OA\Schema()
 */
class Result extends LAMP {
    use ResultDriverGET_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Result"},
     * )
     */
    public $id = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Attachments"
     * )
     */
    public $attachments = null;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Activity"},
     * )
     */
    public $activity = null;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp"
     * )
     */
    public $start_time = null;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp"
     * )
     */
    public $end_time = null;

    /**
     * @OA\Property(
     *   @OA\Schema(@OA\AdditionalProperties())
     * )
     */
    public $static_data = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/TemporalEvent"
     *   )
     * )
     */
    public $temporal_events = null;

    /** 
     * @OA\Get(
     *   path="/result/{result_id}",
     *   operationId="Result::view",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="result_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Result"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function view($result_id) {
        $_id = (new LAMPID($result_id))->require([Result::class]);
        self::authorize(function($type, $value) {
            if ($_id->part(2) > 0) return true; // CTest shortcut

            return false; // TODO surveys
        });
		return null;
    }
    
    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/activity/{activity_id}/result",
     *   operationId="Result::all_by_participant_activity",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="participant_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Participant"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(
     *     name="activity_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Activity"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all_by_participant_activity($participant_id, $activity_id) {
        $aid = (new LAMPID($activity_id))->require([Activity::class]);
        self::authorize(function($type, $value) use($participant_id, $aid) {
            $_id1 = self::parent_of($aid, Activity::class, Researcher::class);
            $_id2 = self::parent_of($participant_id, Participant::class, Researcher::class);
            if ($type == AuthType::Researcher) {
                return $value == $_id1->part(1) && $value == $_id2->part(1);
            } else if ($type == AuthType::Participant) {
                return ($value == $participant_id) && ($_id2->part(1) == $_id1->part(1));
            } else return false;
        });
		return null;
    }
    
    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/result",
     *   operationId="Result::all_by_participant",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="participant_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Participant"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all_by_participant($participant_id) {
        self::authorize(function($type, $value) use($participant_id) {
            if ($type == AuthType::Researcher) {
                $_id = self::parent_of($participant_id, Participant::class, Researcher::class);
                return $value == $_id->part(1);
            } else if ($type == AuthType::Participant) {
                return $value == $participant_id;
            } else return false;
        });
    	return Result::_get(null, $participant_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/study/{study_id}/activity/{activity_id}/result",
     *   operationId="Result::all_by_study_activity",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="study_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Study"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(
     *     name="activity_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Activity"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    /** GET /study/@study_id/activity/@activity_id/result */
    public static function all_by_study_activity($study_id, $activity_id) {
		return Result::all_by_researcher_activity($study_id, $activity_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/activity/{activity_id}/result",
     *   operationId="Result::all_by_researcher_activity",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="researcher_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Researcher"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(
     *     name="activity_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Activity"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all_by_researcher_activity($researcher_id, $activity_id) {
        $_id = (new LAMPID($researcher_id))->require([Researcher::class, Study::class]);
        $aid = (new LAMPID($activity_id))->require([Activity::class]);
        self::authorize(function($type, $value) use($_id, $aid) {
            $_id1 = self::parent_of($aid, Activity::class, Researcher::class);
            return ($type == AuthType::Researcher && 
                        $value == $_id->part(1) && 
                        $value == $_id1->part(1));
        });
		return null;
    }
    
    /** 
     * @OA\Get(
     *   path="/activity/{activity_id}/result",
     *   operationId="Result::all_by_activity",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="activity_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Activity"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all_by_activity($activity_id) {
        $aid = (new LAMPID($activity_id))->require([Activity::class]);
        self::authorize(function($type, $value) use($aid) {
            $_id1 = self::parent_of($aid, Activity::class, Researcher::class);
            if ($type == AuthType::Researcher) {
                return $value == $_id1->part(1);
            } else if ($type == AuthType::Participant) {
                $_id2 = self::parent_of($value, Participant::class, Researcher::class);
                return $_id2->part(1) == $_id1->part(1);
            } else return false;
        });
		return null;
    }
    
    /** 
     * @OA\Get(
     *   path="/study/{study_id}/result",
     *   operationId="Result::all_by_study",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="study_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Study"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all_by_study($study_id) {
        return Result::all_by_researcher($study_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/result",
     *   operationId="Result::all_by_researcher",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="researcher_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Researcher"}
     *       },
     *     )
     *   ),
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all_by_researcher($researcher_id) {
        $_id = (new LAMPID($researcher_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Result::_get(null, null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/result",
     *   operationId="Result::all",
     *   tags={"Result"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Result"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
     * )
     */
    public static function all() {
        self::authorize(function($type, $value) {
            return false;
        });
        return Result::_get();
    }
}
