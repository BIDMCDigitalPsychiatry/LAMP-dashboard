<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/EnvironmentEventDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"home", "school", "work", "hospital", "outside", "shopping", "transit"}
 * )
 */
abstract class LocationContext extends LAMP {
    const Home = "home";
    const School = "school";
    const Work = "work";
    const Hospital = "hospital";
    const Outside = "outside";
    const Shopping = "shopping";
    const Transit = "transit";
}

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"alone", "friends", "family", "peers", "crowd"}
 * )
 */
abstract class SocialContext extends LAMP {
    const Alone = "alone";
    const Friends = "friends";
    const Family = "family";
    const Peers = "peers";
    const Crowd = "crowd";
}

/**
 * @OA\Schema()
 */
class EnvironmentEvent extends LAMP {
    use EnvironmentEventDriverGET_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/EnvironmentEvent"},
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
     *   ref="#/components/schemas/Timestamp"
     * )
     */
    public $timestamp = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     type="number",
     *     format="double"
     *   )
     * )
     */
    public $coordinates = null;

    /** 
     * @OA\Property(
     *   type="number",
     *   format="double"
     * )
     */
    public $accuracy = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/LocationContext"
     * )
     */
    public $location_context = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/SocialContext"
     * )
     */
    public $social_context = null;

    /** 
     * @OA\Get(
     *   path="/environment_event/{environment_event_id}",
     *   operationId="EnvironmentEvent::view",
     *   tags={"EnvironmentEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/EnvironmentEvent"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="environment_event_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/EnvironmentEvent"}
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
    public static function view($environment_event_id) {
        $_id = (new LAMPID($environment_event_id))->require([EnvironmentEvent::class]);
        self::authorize(function($type, $value) {
            $_id1 = self::parent_of($environment_event_id, EnvironmentEvent::class, 
                        $type == AuthType::Researcher ? Researcher::class : Participant::class);
            return $value == ($type == AuthType::Researcher ? $_id1->part(1) : $_id1);
        });
        return EnvironmentEvent::_get(null, null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/environment_event",
     *   operationId="EnvironmentEvent::all_by_participant",
     *   tags={"EnvironmentEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/EnvironmentEvent"}
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
        return EnvironmentEvent::_get($participant_id);
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/environment_event",
     *   operationId="EnvironmentEvent::all_by_study",
     *   tags={"EnvironmentEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/EnvironmentEvent"}
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
        return EnvironmentEvent::all_by_researcher($study_id);
    }

    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/environment_event",
     *   operationId="EnvironmentEvent::all_by_researcher",
     *   tags={"EnvironmentEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/EnvironmentEvent"}
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
        return EnvironmentEvent::_get(null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/environment_event",
     *   operationId="EnvironmentEvent::all",
     *   tags={"EnvironmentEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/EnvironmentEvent"}
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
        return EnvironmentEvent::_get();
    }
}
