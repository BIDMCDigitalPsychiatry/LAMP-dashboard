<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/ActivityDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"game", "survey", "demographics", "batch"}
 * )
 */
abstract class ActivityType extends LAMP {
    const Game = "game";
    const Survey = "survey";
    const Demographics = "demographics";
    const Batch = "batch";
}

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"none", "study", "researcher", "all"}
 * )
 */
abstract class ActivitySharingMode extends LAMP {
    const None = "none";
    const Study = "study";
    const Researcher = "researcher";
    const All = "all";
}

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"likert", "list", "boolean", "clock", "years", "months", "days"}
 * )
 */
abstract class QuestionType extends LAMP {
    const Likert = "likert";
    const List = "list";
    const YesNo = "boolean";
    const Clock = "clock";
    const Years = "years";
    const Months = "months";
    const Days = "days";
}

/**
 * @OA\Schema()
 */
class Question extends LAMP {
    
    /**
     * @OA\Property(
     *   ref="#/components/schemas/QuestionType"
     * )
     */
    public $type = null;

    /** 
     * @OA\Property(
     *   type="string"
     * )
     */
    public $text = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     type="string"
     *   )
     * )
     */
    public $options = null;
}

/**
 * @OA\Schema()
 */
class Activity extends LAMP {
    use ActivityDriverGET_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Activity"},
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
     *   ref="#/components/schemas/ActivityType"
     * )
     */
	public $type = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/ActivitySharingMode"
     * )
     */
    public $sharing_mode = null;

    /** 
     * @OA\Property(
     *   type="string"
     * )
     */
    public $name = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/DurationInterval"
     *   )
     * )
     */
    public $schedule = null;

    /** 
     * @OA\Property(
     *   @OA\Schema(@OA\AdditionalProperties())
     * )
     */
    public $settings = null;

    /** 
     * @OA\Get(
     *   path="/activity/{activity_id}",
     *   operationId="Activity::view",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
    public static function view($activity_id) {
        $_id = (new LAMPID($activity_id))->require([Activity::class]);
        self::authorize(function($type, $value) use($_id) {
            $_id1 = self::parent_of($_id, Activity::class, Researcher::class);
            if ($type == AuthType::Researcher) {
                return $value == $_id1->part(1);
            } else if ($type == AuthType::Participant) {
                $_id2 = self::parent_of($value, Participant::class, Researcher::class);
                return $_id2->part(1) == $_id1->part(1);
            } else return false;
        });
        return Activity::_get([$_id->part(1)], $_id->part(2), 
                               $_id->part(2) , $_id->part(3));
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/activity/type/{type}",
     *   operationId="Activity::all_by_study_type",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
     *     name="type",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       type="#/components/schemas/ActivityType"
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
    public static function all_by_study_type($study_id, $type) {
        return Activity::all_by_researcher_type($study_id, $type);
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/activity",
     *   operationId="Activity::all_by_study",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
        return Activity::all_by_researcher($study_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/activity/type/{type}",
     *   operationId="Activity::all_by_researcher_type",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
     *     name="type",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/ActivityType",
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
    public static function all_by_researcher_type($researcher_id, $type) {
        $_id = (new LAMPID($researcher_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Activity::_get([$type], null, null, $_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/activity",
     *   operationId="Activity::all_by_researcher",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
        return Activity::_get([ActivityType::Game, ActivityType::Survey], null, null, $_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/activity/type/{type}",
     *   operationId="Activity::all_by_participant_type",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
     *     name="type",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/ActivityType",
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
    public static function all_by_participant_type($participant_id, $type) {
        $_id = self::parent_of($participant_id, Participant::class, Researcher::class);
        self::authorize(function($type, $value) use($participant_id, $_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1)) ||
                   ($type == AuthType::Participant && $value == $participant_id);
        });
        return Activity::_get([$type], null, null, $_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/activity",
     *   operationId="Activity::all_by_participant",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
        $_id = self::parent_of($participant_id, Participant::class, Researcher::class);
        self::authorize(function($type, $value) use($participant_id, $_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1)) ||
                   ($type == AuthType::Participant && $value == $participant_id);
        });
        return Activity::_get([ActivityType::Game, ActivityType::Survey], null, null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/activity/type/{type}",
     *   operationId="Activity::all_by_type",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="type",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/ActivityType",
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
    public static function all_by_type($type) {
        self::authorize(function($type, $value) {
            return false;
        });
        return Activity::_get([$type]);
    }

    /** 
     * @OA\Get(
     *   path="/activity",
     *   operationId="Activity::all",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
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
        return Activity::_get([ActivityType::Game, ActivityType::Survey]);
    }
}
