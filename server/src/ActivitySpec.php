<?php
require_once __DIR__ . '/LAMP.php';

/**
 * @OA\Schema()
 */
class ActivitySpec extends LAMP {
	use LAMPDriver_v0_1;

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/Identifier",
	 *   x={"type"="#/components/schemas/ActivitySpec"},
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
	 *   ref="#/components/schemas/ActivitySpecType"
	 * )
	 */
	public $type = null;

	/**
	 * @OA\Get(
	 *   path="/activity_spec/{activity_spec_id}",
	 *   operationId="ActivitySpec::view",
	 *   tags={"ActivitySpec"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/ActivitySpec"}
	 *   },
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="activity_spec_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
	 *       x={"type"={
	 *         "$ref"="#/components/schemas/ActivitySpec"}
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
	public static function view($activity_spec_id) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}

	/**
	 * @OA\Get(
	 *   path="/participant/{participant_id}/activity_spec",
	 *   operationId="ActivitySpec::all_by_participant",
	 *   tags={"ActivitySpec"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/ActivitySpec"}
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
	 *   path="/study/{study_id}/activity_spec",
	 *   operationId="ActivitySpec::all_by_study",
	 *   tags={"ActivitySpec"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/ActivitySpec"}
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
		return ActivitySpec::all_by_researcher($study_id);
	}

	/**
	 * @OA\Get(
	 *   path="/researcher/{researcher_id}/activity_spec",
	 *   operationId="ActivitySpec::all_by_researcher",
	 *   tags={"ActivitySpec"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/ActivitySpec"}
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
	 *   path="/activity_spec",
	 *   operationId="ActivitySpec::all",
	 *   tags={"ActivitySpec"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/ActivitySpec"}
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
