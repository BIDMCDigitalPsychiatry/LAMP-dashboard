<?php
require_once __DIR__ . '/../LAMP.php';
require_once __DIR__ . '/../driver/ParticipantDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"iOS", "Android"},
 *   description="The kind of device a participant is using.",
 * )
 */
abstract class DeviceType {
    const iOS = 'iOS';
    const Android = 'Android';
}

/**
 * @OA\Schema(
 *   description="The settings or health information about a participant."
 * )
 */
class ParticipantSettings {

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The participant's selected theme for the LAMP app.",
     * )
     */
    public $theme = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The participant's selected language code for the LAMP app.",
     * )
     */
    public $language = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp",
     *   description="The date and time when the participant last used the LAMP app.",
     * )
     */
    public $last_login = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/DeviceType",
     *   description="The type of device the participant last used to use to the LAMP app.",
     * )
     */
    public $device_type = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The participant's emergency contact number.",
     * )
     */
    public $emergency_contact = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The participant's selected personal helpline number.",
     * )
     */
    public $helpline = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp",
     *   description="The date and time when the participant last checked the Blogs page.",
     * )
     */
    public $blogs_checked_date = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp",
     *   description="The date and time when the participant last checked the Tips page.",
     * )
     */
    public $tips_checked_date = null;
}

/**
 * @OA\Schema(
 *   description="A participant within a study; a participant cannot be enrolled in more than one study at a time.",
 * )
 */
class Participant {
    use ParticipantDriver;

    /**
     * @OA\Property(
     *   ref="#/components/schemas/Identifier",
     *   x={"type"="#/components/schemas/Participant"},
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
	 *   description="The researcher-provided study code for the participant.",
	 * )
	 */
	public $study_code = null;

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/ParticipantSettings",
     *   description="The settings and information for the participant.",
     * )
     */
    public $settings = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/ResultEvent"},
     *   ),
     *   description="The set of all result events from the participant.",
     * )
     */
    public $result_events = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/MetadataEvent"},
     *   ),
     *   description="The set of all metadata events from the participant.",
     * )
     */
    public $metadata_events = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/SensorEvent"},
     *   ),
     *   description="The set of all sensor events from the participant.",
     * )
     */
    public $sensor_events = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/EnvironmentEvent"},
     *   ),
     *   description="The set of all environment events from the participant.",
     * )
     */
    public $environment_events = null;

    /** 
     * @OA\Property(
     *   type="array",
     *   @OA\Items(
     *     ref="#/components/schemas/Identifier",
     *     x={"type"="#/components/schemas/FitnessEvent"},
     *   ),
     *   description="The set of all fitness events from the participant.",
     * )
     */
    public $fitness_events = null;

	/**
	 * @OA\Post(
	 *   path="/study/{study_id}/participant",
	 *   operationId="Participant::create",
	 *   tags={"Participant"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Participant"}
	 *   },
	 *   summary="Get a single participant, by an identifier.",
	 *   description="Get a single participant, by an identifier.",
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
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       ref="#/components/schemas/Participant"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function create($study_id, $participant) {
		if ($study_id === 'me')
			$study_id = self::me();
		self::authorize(function($type, $value) use($study_id) {
			if ($type == AuthType::Researcher) {
				$_id = self::parent_of($study_id, Participant::class, Researcher::class);
				return $value == $_id->part(1);
			} else if ($type == AuthType::Participant) {
				return $value == $study_id;
			} else return false;
		});
		return self::_insert(null, null);
	}

	/**
	 * @OA\Put(
	 *   path="/participant/{participant_id}",
	 *   operationId="Participant::update",
	 *   tags={"Participant"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Participant"}
	 *   },
	 *   summary="Get a single participant, by an identifier.",
	 *   description="Get a single participant, by an identifier.",
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
	 *       ref="#/components/schemas/Participant"
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function update($participant_id, $participant) {
		if ($participant_id === 'me')
			$participant_id = self::me();
		self::authorize(function($type, $value) use($participant_id) {
			if ($type == AuthType::Researcher) {
				$_id = self::parent_of($participant_id, Participant::class, Researcher::class);
				return $value == $_id->part(1);
			} else if ($type == AuthType::Participant) {
				return $value == $participant_id;
			} else return false;
		});
		return self::_update(null, null);
	}

	/**
	 * @OA\Delete(
	 *   path="/participant/{participant_id}",
	 *   operationId="Participant::delete",
	 *   tags={"Participant"},
	 *   x={"owner"={
	 *     "$ref"="#/components/schemas/Participant"}
	 *   },
	 *   summary="Get a single participant, by an identifier.",
	 *   description="Get a single participant, by an identifier.",
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
	public static function delete($participant_id) {
		if ($participant_id === 'me')
			$participant_id = self::me();
		self::authorize(function($type, $value) use($participant_id) {
			if ($type == AuthType::Researcher) {
				$_id = self::parent_of($participant_id, Participant::class, Researcher::class);
				return $value == $_id->part(1);
			} else if ($type == AuthType::Participant) {
				return $value == $participant_id;
			} else return false;
		});
		return self::_delete(null);
	}

    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}",
     *   operationId="Participant::view",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
     *   },
     *   summary="Get a single participant, by an identifier.",
     *   description="Get a single participant, by an identifier.",
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
    public static function view($participant_id) {
        if ($participant_id === 'me')
             $participant_id = self::me();
        self::authorize(function($type, $value) use($participant_id) {
            if ($type == AuthType::Researcher) {
                $_id = self::parent_of($participant_id, Participant::class, Researcher::class);
                return $value == $_id->part(1);
            } else if ($type == AuthType::Participant) {
                return $value == $participant_id;
            } else return false;
        });
        return self::_select($participant_id, null);
    }
    
    /** 
     * @OA\Get(
     *   path="/study/{study_id}/participant",
     *   operationId="Participant::all_by_study",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
     *   },
     *   summary="Get the set of all participants enrolled in a study, by an identifier.",
     *   description="Get the set of all participants enrolled in a study, by an identifier.",
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
        return Participant::all_by_researcher($study_id);
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/participant",
     *   operationId="Participant::all_by_researcher",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
     *   },
     *   summary="Get the set of all participants enrolled in any studies conducted by a researcher, by an identifier.",
     *   description="Get the set of all participants enrolled in any studies conducted by a researcher, by an identifier.",
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
        return self::_select(null, $_id->part(1));
    }

    /** 
     * @OA\Get(
     *   path="/participant",
     *   operationId="Participant::all",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
     *   },
     *   summary="Get the set of all participants.",
     *   description="Get the set of all participants.",
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
