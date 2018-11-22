<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/ActivityDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"game", "survey", "demographics", "batch"},
 *   description="The kind of activities that may be performed."
 * )
 */
abstract class ActivityType extends LAMP {

    // A game, such as Jewels Trails, or Spatial Span.
    const Game = "game";

    // A custom survey.
    const Survey = "survey";

    // An encrypted demographics survey that might be a consent form or similar.
    const Demographics = "demographics";

    // A batched activity that may not produce any results but allows a sequential or conditional presentation of grouped activities.
    const Batch = "batch";
}

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"none", "study", "researcher", "all"},
 *   description="The sharing restriction type for an activity."
 * )
 */
abstract class ActivitySharingMode extends LAMP {

    // This activity is not shared and can only be used by participants in one study.
    const None = "none";

    // This activity is shared between all studies conducted by one researcher.
    const Study = "study";

    //
    const Researcher = "researcher";

    // This activity is shared across all researchers and studies and can be used by any participant using the LAMP platform.
    const All = "all";
}

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"likert", "list", "boolean", "clock", "years", "months", "days"},
 *   description="The kind of response to a question."
 * )
 */
abstract class QuestionType extends LAMP {

    // A five-point likert scale. The `options` field will be `null`.
    const Likert = "likert";

    // A list of choices to select from.
    const List = "list";

    // A `true` or `false` (or `yes` and `no`) toggle. The `options` field will be `null`.
    const YesNo = "boolean";

    // A time selection clock. The `options` field will be `null`.
    const Clock = "clock";

    // A number of years. The `options` field will be `null`.
    const Years = "years";

    // A number of months. The `options` field will be `null`.
    const Months = "months";

    // A number of days. The `options` field will be `null`.
    const Days = "days";
}

/**
 * @OA\Schema(
 *   description="A question within a survey-type `Activity`."
 * )
 */
class Question extends LAMP {
    
    /**
     * @OA\Property(
     *   ref="#/components/schemas/QuestionType",
     *   description="The type of question within a survey activity."
     * )
     */
    public $type = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The prompt for the question."
     * )
     */
    public $text = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     type="string"
     *   ),
     *   description="Possible option choices for a question of type `list`."
     * )
     */
    public $options = null;
}

/**
 * @OA\Schema(
 *   description="An activity that may be performed by a participant in a study."
 * )
 */
class Activity extends LAMP {
    use ActivityDriver;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Activity"},
     *   description="The self-referencing identifier to this object."
     * )
     */
    public $id = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Attachments",
     *   description="External or out-of-line objects attached to this object."
     * )
     */
    public $attachments = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/ActivityType",
     *   description="The type of the activity."
     * )
     */
	public $type = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The name of the activity."
     * )
     */
    public $name = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/DurationInterval"
     *   ),
     *   description="The notification schedule for the activity."
     * )
     */
    public $schedule = null;

    /** 
     * @OA\Property(
     *   @OA\Schema(@OA\AdditionalProperties()),
     *   description="The configuration settings for the activity."
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
     *   summary="Get a single activity, by identifier.",
     *   description="Get a single activity, by identifier.",
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
        $_id = (new TypeID($activity_id))->require([Activity::class]);
        self::authorize(function($type, $value) use($_id) {
            $_id1 = self::parent_of($_id, Activity::class, Researcher::class);
            if ($type == AuthType::Researcher) {
                return $value == $_id1->part(1);
            } else if ($type == AuthType::Participant) {
                $_id2 = self::parent_of($value, Participant::class, Researcher::class);
                return $_id2->part(1) == $_id1->part(1);
            } else return false;
        });
        return Activity::_select([$_id->part(1)], $_id->part(2),
                               $_id->part(2) , $_id->part(3));
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/activity",
     *   operationId="Activity::all_by_study",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities available to participants of a single study, by study identifier.",
     *   description="Get the set of all activities available to participants of a single study, by study identifier.",
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
     *   path="/researcher/{researcher_id}/activity",
     *   operationId="Activity::all_by_researcher",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities available to participants of any study conducted by a researcher, by researcher identifier.",
     *   description="Get the set of all activities available to participants of any study conducted by a researcher, by researcher identifier.",
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
        $_id = (new TypeID($researcher_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Activity::_select([ActivityType::Game, ActivityType::Survey], null, null, $_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/activity",
     *   operationId="Activity::all_by_participant",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities available to a participant, by participant identifier.",
     *   description="Get the set of all activities available to a participant, by participant identifier.",
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
        return Activity::_select([ActivityType::Game, ActivityType::Survey], null, null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/activity",
     *   operationId="Activity::all",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities.",
     *   description="Get the set of all activities.",
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
        return Activity::_select([ActivityType::Game, ActivityType::Survey]);
    }
}
