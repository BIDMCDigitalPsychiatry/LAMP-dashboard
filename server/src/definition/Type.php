<?php
require_once __DIR__ . '/../LAMP.php';

/**
 * @OA\Schema(
 *   schema="Identifier",
 *   type="string",
 *   description="A globally unique reference for objects within the LAMP platform.",
 * )
 *
 * Use `require()` to restrict the ID to certain prefix(s) and `part()` to
 * access ID components safely. Note: DO NOT use the reserved character ':' in any
 * component strings.
 */
class TypeID implements JsonSerializable {
	private $components = [];
	public function __construct($value) {
		if (is_string($value)) {
			$this->components = explode(":", base64_decode(strtr($value, '_-~', '+/=')));
		} else if (is_array($value))
			$this->components = $value;
		else throw new Exception('invalid LAMP ID value');
	}
	public function jsonSerialize() {
		return strtr(base64_encode(implode(':', $this->components)), '+/=', '_-~');
	}
	public function require($match_prefix) {
		if (!in_array($this->components[0], $match_prefix))
			throw new LAMPException("invalid identifier", 403);
		return $this;
	}
	public function part($idx) {
		return isset($this->components[$idx]) ? $this->components[$idx] : null;
	}
}

/**
 * @OA\Schema(
 *   schema="TypeSpec",
 *   description="Runtime type specification for each object in the LAMP platform.",
 * )
 *
 * TODO: parent_of, obj hierarchies, etc.
 */
class TypeSpec extends LAMP {
	use TypeDriver;


}

/**
 *
 */
class TypeAttachment extends LAMP {
	use TypeDriver;

	/**
	 * @OA\Get(
	 *   path="/type/{type_id}/attachment/{attachment_key}",
	 *   operationId="Type::get_attachment",
	 *   tags={"Type"},
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="type_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function get_attachment($type_id, $attachment_key) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}

	/**
	 * @OA\Put(
	 *   path="/type/{type_id}/attachment/{attachment_key}",
	 *   operationId="Type::set_attachment",
	 *   tags={"Type"},
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="type_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
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
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       required={"$attachment_value"},
	 *       @OA\Property(
	 *         property="$attachment_value"
	 *       ),
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function set_attachment($type_id, $attachment_key, $attachment_value) {
		$_id = (new TypeID($researcher_id))->require([Researcher::class]);
		self::authorize(function($type, $value) use($_id) {
			return ($type == AuthType::Researcher && $value == $_id->part(1));
		});
		$_id = $_id->jsonSerialize();

		return Researcher::_setX($_id, Participant::class, $attachment_key, $script_contents, $script_requirements);

		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}

	/**
	 * @OA\Delete(
	 *   path="/type/{type_id}/attachment/{attachment_key}",
	 *   operationId="Type::delete_attachment",
	 *   tags={"Type"},
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="type_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function delete_attachment($type_id, $attachment_key) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}

	/**
	 * @OA\Get(
	 *   path="/type/{type_id}/dynamic_attachment/{attachment_key}",
	 *   operationId="Type::get_dynamic_attachment",
	 *   tags={"Type"},
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="type_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function get_dynamic_attachment($type_id, $attachment_key) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}

	/**
	 * @OA\Put(
	 *   path="/type/{type_id}/dynamic_attachment/{attachment_key}",
	 *   operationId="Type::set_dynamic_attachment",
	 *   tags={"Type"},
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="type_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
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
	 *   @OA\RequestBody(
	 *     required=true,
	 *     @OA\JsonContent(
	 *       required={"from", "to", "type", "contents", "requirements"},
	 *       @OA\Property(
	 *         property="from",
	 *         type="string",
	 *       ),
	 *       @OA\Property(
	 *         property="to",
	 *         type="string",
	 *       ),
	 *       @OA\Property(
	 *         property="type",
	 *         type="string",
	 *       ),
	 *       @OA\Property(
	 *         property="contents",
	 *         type="string",
	 *       ),
	 *       @OA\Property(
	 *         property="requirements",
	 *         type="array",
	 *         @OA\Items(
	 *           type="string"
	 *         ),
	 *       ),
	 *     ),
	 *   ),
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function set_dynamic_attachment($type_id, $attachment_key, $from, $to, $type, $contents, $requirements) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}

	/**
	 * @OA\Delete(
	 *   path="/type/{type_id}/dynamic_attachment/{attachment_key}",
	 *   operationId="Type::delete_dynamic_attachment",
	 *   tags={"Type"},
	 *   summary="",
	 *   description="",
	 *   @OA\Parameter(
	 *     name="type_id",
	 *     in="path",
	 *     required=true,
	 *     @OA\Schema(
	 *       ref="#/components/schemas/Identifier",
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function delete_dynamic_attachment($type_id, $attachment_key) {
		self::authorize(function($type, $value) {
			return false; // TODO
		});
		return null;
	}
}

/**
 * TODO: DELETE!
 */
class TypeLegacySupport extends LAMP {
	use TypeDriver;

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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function set_attachment($researcher_id, $attachment_key, $script_type, $script_contents, $script_requirements) {
		$_id = (new TypeID($researcher_id))->require([Researcher::class]);
		self::authorize(function($type, $value) use($_id) {
			return ($type == AuthType::Researcher && $value == $_id->part(1));
		});
		$_id = $_id->jsonSerialize();

		return Researcher::_setX($_id, Participant::class, $attachment_key, $script_contents, $script_requirements);
	}

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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
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

			// Fill in the Activity for all Results.
			if ($res->activity !== null) {
				$n = array_map(function($x) {
					return $x->name;
				}, array_filter($a, function($x) use($res) {
					return $x->id == $res->activity;
				}));
				$res->activity = array_shift($n);
			} else $res->activity = array_drop($res->static_data, 'survey_name');

			// Match the result to the correct event(s), if any.
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
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

			// Fill in the Activity for all Results.
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
}
