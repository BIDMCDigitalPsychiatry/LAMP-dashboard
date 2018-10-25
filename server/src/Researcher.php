<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/ResearcherDriver.php';

/**
 * @OA\Schema(
 *   description="A researcher using the LAMP platform.",
 * )
 */
class Researcher extends LAMP {
    use ResearcherDriverGET_v0_1;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Researcher"},
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
     *   description="The name of the researcher.",
     * )
     */
    public $name = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The email address of the researcher.",
     * )
     */
    public $email = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The physical address of the researcher.",
     * )
     */
    public $address = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/Study"},
     *   ),
     *   description="The set of all studies conducted by the researcher.",
     * )
     */
    public $studies = null;
    
    /** 
     * @OA\Post(
     *   path="/researcher/{researcher_id}/attachment/{attachment_key}",
     *   operationId="Researcher::set_attachment",
     *   tags={"Researcher"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Researcher"}
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
     *     ),
     *   ),
     *   @OA\Parameter(
     *     name="attachment_key",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       type="string",
     *     ),
     *   ),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"script_type", "script_contents", "script_requirements"},
     *       @OA\Property(
     *         property="script_type",
     *         type="string",
     *       ),
     *       @OA\Property(
     *         property="script_contents",
     *         type="string",
     *       ),
     *       @OA\Property(
     *         property="script_requirements",
     *         type="array",
     *         @OA\Items(
     *           type="string"
     *         ),
     *       ),
     *     ),
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
    public static function set_attachment($researcher_id, $attachment_key, $script_type, $script_contents, $script_requirements) {
        $_id = (new LAMPID($researcher_id))->require([Researcher::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        $_id = $_id->jsonSerialize();

        return Researcher::_setX($_id, Participant::class, $attachment_key, $script_contents, $script_requirements);
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}",
     *   operationId="Researcher::view",
     *   tags={"Researcher"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Researcher"}
     *   },
     *   summary="Get a single researcher, by an identifier.",
     *   description="Get a single researcher, by an identifier.",
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
    public static function view($researcher_id) {
        if ($researcher_id === 'me')
             $_id = self::me();
        else $_id = (new LAMPID($researcher_id))->require([Researcher::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Researcher::_get($_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/",
     *   operationId="Researcher::all",
     *   tags={"Researcher"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Researcher"}
     *   },
     *   summary="Get the set of all researchers.",
     *   description="Get the set of all researchers.",
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
        return Researcher::_get();
    }
}
