<?php
require_once __DIR__ . '/LAMP.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"tap", "page", "notification", "error"}
 * )
 */
abstract class MetadataEventType extends LAMP {
    const Tap = "tap";
    const Page = "page";
    const Notification = "notification";
    const Error = "error";
}

/**
 * @OA\Schema()
 */
class MetadataEvent extends LAMP {
    use LAMPDriver_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/MetadataEvent"},
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
     *   ref="#/components/schemas/MetadataEventType"
     * )
     */
    public $type = null; 

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp"
     * )
     */
    public $timestamp = null;

    /** 
     * @OA\Property(
     *   type="string"
     * )
     */
    public $item = null;

    /** 
     * @OA\Get(
     *   path="/metadata_event/{metadata_event_id}",
     *   operationId="MetadataEvent::view",
     *   tags={"MetadataEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/MetadataEvent"}
     *   },
     *   summary="",
     *   description="",
     *   @OA\Parameter(
     *     name="metadata_event_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/MetadataEvent"}
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
    public static function view($metadata_event_id) {
        self::authorize(function($type, $value) {
            return false; // TODO
        });
        return null;
    }

    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/metadata_event",
     *   operationId="MetadataEvent::all_by_participant",
     *   tags={"MetadataEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/MetadataEvent"}
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
     *   path="/study/{study_id}/metadata_event",
     *   operationId="MetadataEvent::all_by_study",
     *   tags={"MetadataEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/MetadataEvent"}
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
        return MetadataEvent::all_by_researcher($study_id);
    }

    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/metadata_event",
     *   operationId="MetadataEvent::all_by_researcher",
     *   tags={"MetadataEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/MetadataEvent"}
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
     *   path="/metadata_event",
     *   operationId="MetadataEvent::all",
     *   tags={"MetadataEvent"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/MetadataEvent"}
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
