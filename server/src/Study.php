<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/StudyDriver.php';

/**
 * @OA\Schema()
 */
class Study extends LAMP {
    use StudyDriverGET_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Study"},
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
     *   type="string"
     * )
     */
    public $name = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/Activity"},
     *   )
     * )
     */
    public $activities = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/Participant"},
     *   )
     * )
     */
    public $participants = null;
    
    /** 
     * @OA\Get(
     *   path="/study/{study_id}",
     *   operationId="Study::view",
     *   tags={"Study"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Study"}
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
    public static function view($study_id) {
        $_id = (new LAMPID($study_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Study::_get($_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/study",
     *   operationId="Study::all_by_researcher",
     *   tags={"Study"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Study"}
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
        return Study::view($researcher_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/study",
     *   operationId="Study::all",
     *   tags={"Study"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Study"}
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
    	return Study::_get();
    }
}
