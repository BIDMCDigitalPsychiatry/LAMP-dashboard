<?php
require_once __DIR__ . '/../LAMP.php';
require_once __DIR__ . '/../driver/ResearcherDriver.php';

/**
 * @OA\Schema(
 *   description="A researcher using the LAMP platform.",
 * )
 */
class Researcher {
    use ResearcherDriver;

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
	 *   path="/researcher",
	 *   operationId="Researcher::create",
	 *   tags={"Researcher"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Researcher"}
	 *   },
	 *   summary="Get a single researcher, by an identifier.",
	 *   description="Get a single researcher, by an identifier.",
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/schemas/SensorEvent"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function create($researcher) {
		self::authorize(function ($type, $value) {
			return false;
		});
		return self::_insert(null);
	}

	/**
	 * @OA\Put(
	 *   path="/researcher/{researcher_id}",
	 *   operationId="Researcher::update",
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
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/schemas/Researcher"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function update($researcher_id, $researcher) {
		if ($researcher_id === 'me')
			$_id = self::me();
		else $_id = (new TypeID($researcher_id))->require([Researcher::class]);
		self::authorize(function ($type, $value) use ($_id) {
			return ($type == AuthType::Researcher && $value == $_id->part(1));
		});
		return self::_update(null, null);
	}

	/**
	 * @OA\Delete(
	 *   path="/researcher/{researcher_id}",
	 *   operationId="Researcher::delete",
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function delete($researcher_id) {
		if ($researcher_id === 'me')
			$_id = self::me();
		else $_id = (new TypeID($researcher_id))->require([Researcher::class]);
		self::authorize(function ($type, $value) use ($_id) {
			return ($type == AuthType::Researcher && $value == $_id->part(1));
		});
		return self::_delete(null);
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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
     * )
     */
    public static function view($researcher_id) {
        if ($researcher_id === 'me')
             $_id = self::me();
        else $_id = (new TypeID($researcher_id))->require([Researcher::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return self::_select($_id->part(1));
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
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"Authorization": {}}},
     * )
     */
    public static function all() {
        self::authorize(function($type, $value) {
            return false;
        });
        return self::_select();
    }
}
