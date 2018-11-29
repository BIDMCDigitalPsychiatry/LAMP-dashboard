<?php
require_once __DIR__ . '/../LAMP.php';

/**
 * @OA\Schema(
 *   description=""
 * )
 */
class SensorEvent extends LAMP {
    use SensorEventDriver;

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
	 * @OA\Post(
	 *   path="/participant/{participant_id}/sensor_event/",
	 *   operationId="SensorEvent::create",
	 *   tags={"SensorEvent"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/SensorEvent"}
	 *   },
	 *   summary="Get a single sensor event, by identifier.",
	 *   description="Get a single sensor event, by identifier.",
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
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/responses/SensorEvent"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function create($participant_id, $sensor_event) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return self::_insert(null);
	}

	/**
	 * @OA\Put(
	 *   path="/sensor_event/{sensor_event_id}",
	 *   operationId="SensorEvent::view",
	 *   tags={"SensorEvent"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/SensorEvent"}
	 *   },
	 *   summary="Get a single sensor event, by identifier.",
	 *   description="Get a single sensor event, by identifier.",
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
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/responses/SensorEvent"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function update($sensor_event_id, $sensor_event) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return self::_update(null, null);
	}

	/**
	 * @OA\Delete(
	 *   path="/sensor_event/{sensor_event_id}",
	 *   operationId="SensorEvent::delete",
	 *   tags={"SensorEvent"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/SensorEvent"}
	 *   },
	 *   summary="Get a single sensor event, by identifier.",
	 *   description="Get a single sensor event, by identifier.",
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function delete($sensor_event_id) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return self::_delete(null);
	}

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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
     * )
     */
    public static function all() {
        self::authorize(function($type, $value) {
            return true;
        });
        return null;
    }
}
