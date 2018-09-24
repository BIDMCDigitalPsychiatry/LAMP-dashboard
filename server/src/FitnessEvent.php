<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/FitnessEventDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"height", "weight", "heart_rate", "blood_pressure", "respiratory_rate", "sleep", "steps", "flights"}
 * )
 */
abstract class FitnessSampleType extends LAMP {
    const Height = "height";
    const Weight = "weight";
    const HeartRate = "heart_rate";
    const BloodPressure = "blood_pressure";
    const RespiratoryRate = "respiratory_rate";
    const Sleep = "sleep";
    const Steps = "steps";
    const Flights = "flights";
}

/**
 * @OA\Schema()
 */
class FitnessSample extends LAMP {

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/FitnessSampleType"
     * )
     */
    public $type = null;

    /** 
     * @OA\Property(
     *   type="string"
     * )
     */
    public $unit = null;

    /** 
     * @OA\Property()
     */
    public $value = null;
}

/**
 * @OA\Schema()
 */
class FitnessEvent extends LAMP {
    use FitnessEventDriver_v0_1;
    
    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/FitnessEvent"},
     * )
     */
    public $id = "";

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Attachments"
     * )
     */
    public $attachments = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp"
     * )
     */
    public $timestamp = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/FitnessSample"
     *   )
     * )
     */
    public $record = null;

    /** 
     * @OA\Get(
     *   path="/fitness_event/{fitness_event_id}",
     *   operationId="FitnessEvent::view",
     *   tags={"FitnessEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/FitnessEvent"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="fitness_event_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/FitnessEvent"}
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
    public static function view($fitness_event_id) {
        $_id = (new LAMPID($fitness_event_id))->require([FitnessEvent::class]);
        self::authorize(function($type, $value) {
            $_id1 = self::parent_of($fitness_event_id, FitnessEvent::class, 
                        $type == AuthType::Researcher ? Researcher::class : Participant::class);
            return $value == ($type == AuthType::Researcher ? $_id1->part(1) : $_id1);
        });
        return FitnessEvent::_get(null, null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/fitness_event",
     *   operationId="FitnessEvent::all_by_participant",
     *   tags={"FitnessEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/FitnessEvent"}
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
        return FitnessEvent::_get($participant_id);
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/fitness_event",
     *   operationId="FitnessEvent::all_by_study",
     *   tags={"FitnessEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/FitnessEvent"}
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
        return FitnessEvent::all_by_researcher($study_id);
    }

    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/fitness_event",
     *   operationId="FitnessEvent::all_by_researcher",
     *   tags={"FitnessEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/FitnessEvent"}
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
        return FitnessEvent::_get(null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/fitness_event",
     *   operationId="FitnessEvent::all",
     *   tags={"FitnessEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/FitnessEvent"}
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
        return FitnessEvent::_get();
    }
}
