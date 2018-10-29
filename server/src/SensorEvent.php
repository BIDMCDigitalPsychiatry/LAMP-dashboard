<?php
require_once __DIR__ . '/LAMP.php';

/**
 * @OA\Schema(
 *   description=""
 * )
 */
class SensorEvent extends LAMP {
    use LAMPDriver_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/SensorEvent"},
     *   description=""
     * )
     */
    public $id = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Attachments",
     *   description=""
     * )
     */
    public $attachments = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description=""
     * )
     */
    public $sensor_name = null; 

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp",
     *   description=""
     * )
     */
    public $timestamp = null;

    /** 
     * @OA\Property(
     *   @OA\Schema(@OA\AdditionalProperties()),
     *   description=""
     * )
     */
    public $data = null;

    /** 
     * @OA\Get(
     *   path="/sensor_event/{sensor_event_id}",
     *   operationId="SensorEvent::view",
     *   tags={"SensorEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/SensorEvent"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="sensor_event_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/SensorEvent"}
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
    public static function view($sensor_event_id) {
        self::authorize(function($type, $value) {
            return false; // TODO
        });
        return null;
    }

    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/sensor_event",
     *   operationId="SensorEvent::all_by_participant",
     *   tags={"SensorEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/SensorEvent"}
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
            return false; // TODO
        });
        return null;
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/sensor_event",
     *   operationId="SensorEvent::all_by_study",
     *   tags={"SensorEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/SensorEvent"}
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
        return SensorEvent::all_by_researcher($study_id);
    }

    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/sensor_event",
     *   operationId="SensorEvent::all_by_researcher",
     *   tags={"SensorEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/SensorEvent"}
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
        self::authorize(function($type, $value) {
            return false; // TODO
        });
        return null;
    }

    /** 
     * @OA\Get(
     *   path="/sensor_event",
     *   operationId="SensorEvent::all",
     *   tags={"SensorEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/SensorEvent"}
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
            return true;
        });
        return null;
    }
}
