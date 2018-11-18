<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/StudyDriver.php';

/**
 * @OA\Schema(
 *   description="A study conducted by a `Researcher`.",
 * )
 */
class Study extends LAMP {
    use StudyDriver;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Study"},
     *   description="The self-referencing identifier to this object.",
     * )
     */
    public $id = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Attachments",
     *   description="External or out-of-line objects attached to this object.",
     * )
     */
    public $attachments = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The name of the study.",
     * )
     */
    public $name = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/Activity"},
     *   ),
     *   description="The set of all activities available in the study.",
     * )
     */
    public $activities = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/Participant"},
     *   ),
     *   description="The set of all enrolled participants in the study.",
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
     *   summary="Get a single study, by an identifier.",
     *   description="Get a single study, by an identifier.",
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
        $_id = (new TypeID($study_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Study::_select($_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/study",
     *   operationId="Study::all_by_researcher",
     *   tags={"Study"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Study"}
     *   },
     *   summary="Get the set of all studies conducted by a single researcher, by an identifier.",
     *   description="Get the set of all studies conducted by a single researcher, by an identifier.",
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
     *   summary="Get the set of all studies.",
     *   description="Get the set of all studies.",
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
    	return Study::_select();
    }
}
