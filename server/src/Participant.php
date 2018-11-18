<?php
require_once __DIR__ . '/LAMP.php';
require_once __DIR__ . '/driver/v0.1/ParticipantDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"iOS", "Android"},
 *   description="The kind of device a participant is using.",
 * )
 */
abstract class DeviceType extends LAMP {
    const iOS = 'iOS';
    const Android = 'Android';
}

/**
 * @OA\Schema(
 *   description="The settings or health information about a participant."
 * )
 */
class ParticipantSettings extends LAMP {

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The researcher-provided study code for the participant.",
     * )
     */
    public $study_code = null;

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

    /** 
     * @OA\Property(
     *   ref="#/components/schemas/Timestamp",
     *   description="The participant's date of birth.",
     * )
     */
    public $date_of_birth = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The participant's sex.",
     * )
     */
    public $sex = null;

    /** 
     * @OA\Property(
     *   type="string",
     *   description="The participant's blood type.",
     * )
     */
    public $blood_type = null;
}

/**
 * @OA\Schema(
 *   description="A participant within a study; a participant cannot be enrolled in more than one study at a time.",
 * )
 */
class Participant extends LAMP {
    use ParticipantDriverGET_v0_1;

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
     * @OA\Get(
     *   path="/participant/{participant_id}/export",
     *   operationId="Participant::export",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
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
    public static function export($participant_id) {

        // Prepare for a within-subject export document.
        $a = Activity::all_by_participant($participant_id);
        $r = ResultEvent::all_by_participant($participant_id) ?: [];
        $e = EnvironmentEvent::all_by_participant($participant_id) ?: [];
        $f = FitnessEvent::all_by_participant($participant_id) ?: [];

        // We have to retrieve all referenced data and synthesize the object.
        foreach ($r as &$res) {

            // Fill in the Activity for all ResultEvents.
            if ($res->activity !== null) {
                $n = array_map(function($x) {
                    return $x->name;
                }, array_filter($a, function($x) use($res) { 
                    return $x->id == $res->activity; 
                }));
                $res->activity = array_shift($n);
            } else $res->activity = array_drop($res->static_data, 'survey_name');

            // Match the result event to the correct event(s), if any.
            $this_e = array_filter($e, function($x) use($res) {
                return ($x->timestamp >= $res->timestamp - 1800000) &&
                       ($x->timestamp <= ($res->timestamp + $res->duration) + 300000);
            });
            $this_f = array_filter($f, function($x) use($res) {
                return ($x->timestamp >= $res->timestamp - 1800000) &&
                       ($x->timestamp <= ($res->timestamp + $res->duration) + 300000);
            });
            $res->environment_event = count($this_e) >= 1 ? reset($this_e) : null;
            $res->fitness_event = count($this_f) >= 1 ? reset($this_f) : null;
        }
        return $r;
    }
    
    /** 
     * @OA\Get(
     *   path="/researcher/{researcher_id}/export",
     *   operationId="Participant::export_all",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
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
    public static function export_all($researcher_id) {

        // Prepare for a between-subject export document.
        $a = Activity::all_by_researcher($researcher_id);
        $all_p = self::all_by_researcher($researcher_id);
        foreach ($all_p as &$p) {

            // We have to retrieve all referenced data and synthesize the object.
            $p->result_events = ResultEvent::all_by_participant($p->id) ?: [];
            $p->environment_events = EnvironmentEvent::all_by_participant($p->id) ?: [];
            $p->fitness_events = FitnessEvent::all_by_participant($p->id) ?: [];

            // Fill in the Activity for all ResultEvents.
            foreach ($p->result_events as &$res) {
                if ($res->activity !== null) {
                    $n = array_map(function($x) {
                        return $x->name;
                    }, array_filter($a, function($x) use($res) { 
                        return $x->id == $res->activity; 
                    }));
                    $res->activity = array_shift($n);
                } else $res->activity = array_drop($res->static_data, 'survey_name');
            }
        }
        return $all_p;
    }

    /** 
     * @OA\Get(
     *   path="/participant/{participant_id}/attachment/{attachment_key}",
     *   operationId="Participant::get_attachment",
     *   tags={"Participant"},
     *   x={"owner"={
     *     "$ref"="#/components/schemas/Participant"}
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
     *   @OA\Parameter(
     *     name="attachment_key",
     *     in="path",
     *     required=true,
     *     @OA\Schema(
     *       type="string",
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
    public static function get_attachment($participant_id, $attachment_key) {
        $_id = self::parent_of($participant_id, Participant::class, Researcher::class);
        self::authorize(function($type, $value) use($participant_id, $_id) {
            if ($type == AuthType::Researcher) {
                return $value == $_id->part(1);
            } else if ($type == AuthType::Participant) {
                return $value == $participant_id;
            } else return false;
        });
        $_id = $_id->jsonSerialize();

        // Get a matching linker entry and clean it up/bail otherwise.
        $keyset = Participant::_getX($_id, Participant::class, $attachment_key);
        if ($keyset === null || !trim($keyset["ScriptContents"])) return null;
        if ($keyset["ReqPackages"] !== null)
            $keyset["ReqPackages"] = json_decode($keyset["ReqPackages"]);
        else $keyset["ReqPackages"] = [];

        // Collect input object for the RScript.
        $p = Participant::view($participant_id);
        $a = Activity::all_by_participant($participant_id);
        $r = ResultEvent::all_by_participant($participant_id) ?: [];
        $p['result_events'] = $r;

        // Execute the Rscript, if any.
        return RScriptRunner::execute(
            $keyset["ScriptContents"], 
            [
                "result" => [
                    "participant" => $p,
                    "activities" => $a
                ], 
                "_plot" => [
                    "type" => "pdf",
                    "width" => 800,
                    "height" => 600
                ]
            ], 
            $keyset["ReqPackages"]
        );
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
     *   @OA\Parameter(ref="#/components/parameters/Export"),
     *   @OA\Parameter(ref="#/components/parameters/XPath"),
     *   @OA\Response(response=200, ref="#/components/responses/Success"),
     *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
     *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
     *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
     *   security={{"AuthorizationLegacy": {}}},
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
        return Participant::_get($participant_id, null);
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
        $_id = (new LAMPID($researcher_id))->require([Researcher::class, Study::class]);
        self::authorize(function($type, $value) use($_id) {
            return ($type == AuthType::Researcher && $value == $_id->part(1));
        });
        return Participant::_get(null, $_id->part(1));
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
        return Participant::_get();
    }
}
