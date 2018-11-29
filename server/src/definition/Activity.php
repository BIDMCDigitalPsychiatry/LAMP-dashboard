<?php
require_once __DIR__ . '/../LAMP.php';
require_once __DIR__ . '/../driver/ActivityDriver.php';

/**
 * @OA\Schema(
 *   description="An activity that may be performed by a participant in a study."
 * )
 */
class Activity extends LAMP {
    use ActivityDriver;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Activity"},
     *   description="The self-referencing identifier to this object."
     * )
     */
    public $id = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Attachments",
     *   description="External or out-of-line objects attached to this object."
     * )
     */
    public $attachments = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/ActivitySpec",
     *   description="The specification, parameters, and type of the activity."
     * )
     */
	public $spec = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The name of the activity."
     * )
     */
    public $name = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/DurationIntervalLegacy"
     *   ),
     *   description="The notification schedule for the activity."
     * )
     */
    public $schedule = null;

    /** 
     * @OA\Property(
     *   @OA\Schema(@OA\AdditionalProperties()),
     *   description="The configuration settings for the activity."
     * )
     */
    public $settings = null;

	/**
	 * @OA\Post(
	 *   path="/study/{study_id}/activity",
	 *   operationId="Activity::create",
	 *   tags={"Activity"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Activity"}
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
	 *     ),
	 *   ),
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/responses/Activity"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function create($study_id, $activity) {
		$_id = (new TypeID($study_id))->require([Activity::class]);
		self::authorize(function($type, $value) use($_id) {
			$_id1 = self::parent_of($_id, Activity::class, Researcher::class);
			if ($type == AuthType::Researcher) {
				return $value == $_id1->part(1);
			} else if ($type == AuthType::Participant) {
				$_id2 = self::parent_of($value, Participant::class, Researcher::class);
				return $_id2->part(1) == $_id1->part(1);
			} else return false;
		});
		return self::_insert(null, null);
	}

	/**
	 * @OA\Put(
	 *   path="/activity/{activity_id}/activity",
	 *   operationId="Activity::update",
	 *   tags={"Activity"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Activity"}
	 *   },
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="activity_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
	 *       x={"type"={
	 *         "$ref"="#/components/schemas/Activity"}
	 *       },
	 *     ),
	 *   ),
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/responses/Activity"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function update($activity_id, $activity) {
		$_id = (new TypeID($activity_id))->require([Activity::class]);
		self::authorize(function($type, $value) use($_id) {
			$_id1 = self::parent_of($_id, Activity::class, Researcher::class);
			if ($type == AuthType::Researcher) {
				return $value == $_id1->part(1);
			} else if ($type == AuthType::Participant) {
				$_id2 = self::parent_of($value, Participant::class, Researcher::class);
				return $_id2->part(1) == $_id1->part(1);
			} else return false;
		});
		return self::_update(null, null, null, null);
	}

	/**
	 * @OA\Delete(
	 *   path="/activity/{activity_id}/activity",
	 *   operationId="Activity::delete",
	 *   tags={"Activity"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Activity"}
	 *   },
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="activity_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
	 *       x={"type"={
	 *         "$ref"="#/components/schemas/Activity"}
	 *       },
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function delete($activity_id) {
		$_id = (new TypeID($activity_id))->require([Activity::class]);
		self::authorize(function($type, $value) use($_id) {
			$_id1 = self::parent_of($_id, Activity::class, Researcher::class);
			if ($type == AuthType::Researcher) {
				return $value == $_id1->part(1);
			} else if ($type == AuthType::Participant) {
				$_id2 = self::parent_of($value, Participant::class, Researcher::class);
				return $_id2->part(1) == $_id1->part(1);
			} else return false;
		});
		return self::_delete(null, null, null);
	}

    /** 
     * @OA\Get(
     *   path="/activity/{activity_id}",
     *   operationId="Activity::view",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get a single activity, by identifier.",
     *   description="Get a single activity, by identifier.",
     *   @OA\Parameter(
     *     name="activity_id",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       ref="#/components/schemas/Identifier",
     *       x={"type"={
     *         "$ref"="#/components/schemas/Activity"}
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
    public static function view($activity_id) {
        $_id = (new TypeID($activity_id))->require([Activity::class]);
        self::authorize(function($type, $value) use($_id) {
            $_id1 = self::parent_of($_id, Activity::class, Researcher::class);
            if ($type == AuthType::Researcher) {
                return $value == $_id1->part(1);
            } else if ($type == AuthType::Participant) {
                $_id2 = self::parent_of($value, Participant::class, Researcher::class);
                return $_id2->part(1) == $_id1->part(1);
            } else return false;
        });
        return self::_select($_id->part(1), $_id->part(3) , $_id->part(2));
    }

    /** 
     * @OA\Get(
     *   path="/study/{study_id}/activity",
     *   operationId="Activity::all_by_study",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities available to participants of a single study, by study identifier.",
     *   description="Get the set of all activities available to participants of a single study, by study identifier.",
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
        return Activity::all_by_researcher($study_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/activity",
     *   operationId="Activity::all_by_researcher",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities available to participants of any study conducted by a researcher, by researcher identifier.",
     *   description="Get the set of all activities available to participants of any study conducted by a researcher, by researcher identifier.",
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
        $_id = (new TypeID($researcher_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return self::_select(null, null, $_id->part(1));
    }
    
    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/activity",
     *   operationId="Activity::all_by_participant",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities available to a participant, by participant identifier.",
     *   description="Get the set of all activities available to a participant, by participant identifier.",
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
        $_id = self::parent_of($participant_id, Participant::class, Researcher::class);
        self::authorize(function($type, $value) use($participant_id, $_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1)) ||
                   ($type == AuthType::Participant && $value == $participant_id);
        });
        return self::_select(null, null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/activity",
     *   operationId="Activity::all",
     *   tags={"Activity"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Activity"}
     *   },
     *   summary="Get the set of all activities.",
     *   description="Get the set of all activities.",
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
