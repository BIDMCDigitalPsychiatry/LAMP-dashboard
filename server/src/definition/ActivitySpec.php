<?php
require_once __DIR__ . '/../LAMP.php';
require_once __DIR__ . '/../driver/ActivitySpecDriver.php';

/**
 * @OA\Schema(
 *   type="string",
 *   enum={"likert", "list", "boolean", "clock", "years", "months", "days"},
 *   description="The kind of response to a question."
 * )
 */
abstract class QuestionType extends LAMP {

	// A five-point likert scale. The `options` field will be `null`.
	const Likert = "likert";

	// A list of choices to select from.
	const List = "list";

	// A `true` or `false` (or `yes` and `no`) toggle. The `options` field will be `null`.
	const YesNo = "boolean";

	// A time selection clock. The `options` field will be `null`.
	const Clock = "clock";

	// A number of years. The `options` field will be `null`.
	const Years = "years";

	// A number of months. The `options` field will be `null`.
	const Months = "months";

	// A number of days. The `options` field will be `null`.
	const Days = "days";
}

/**
 * @OA\Schema(
 *   description="A question within a survey-type `Activity`."
 * )
 */
class Question extends LAMP {

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/QuestionType",
	 *   description="The type of question within a survey activity."
	 * )
	 */
	public $type = null;

	/**
	 * @OA\Property(
	 *   type="string",
	 *   description="The prompt for the question."
	 * )
	 */
	public $text = null;

	/**
	 * @OA\Property(
	 *   type="array",
	 *   @OA\Items(
	 *     type="string"
	 *   ),
	 *   description="Possible option choices for a question of type `list`."
	 * )
	 */
	public $options = null;
}

/**
 * @OA\Schema(
 *   description="The parameters of a setting, static data, or temporal event key, for an ActivitySpec."
 * )
 */
class ActivitySpecItem extends LAMP {

	/**
	 * @OA\Property(
	 *   type="string",
	 *   description="None.",
	 * )
	 */
	public $name = null;

	/**
	 * @OA\Property(
	 *   type="string",
	 *   description="None.",
	 * )
	 */
	public $type = null;

	/**
	 * @OA\Property(
	 *   type="string",
	 *   description="None.",
	 * )
	 */
	public $default = null;
}

/**
 * @OA\Schema(
 *   description="The definition of an Activity's ResultEvents."
 * )
 */
class ActivityDefinition extends LAMP {

	/**
	 * @OA\Property(
	 *   type="array",
	 *   @OA\Items(ref="#/components/schemas/ActivitySpecItem")
	 * )
	 */
	public $static_data = null;

	/**
	 * @OA\Property(
	 *   type="array",
	 *   @OA\Items(ref="#/components/schemas/ActivitySpecItem")
	 * )
	 */
	public $temporal_event = null;

	/**
	 * @OA\Property(
	 *   type="array",
	 *   @OA\Items(ref="#/components/schemas/ActivitySpecItem")
	 * )
	 */
	public $settings = null;
}

/**
 * @OA\Schema()
 */
class ActivitySpec extends LAMP {
	use ActivitySpecDriver;

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
	 *   type="string"
	 * )
	 */
	public $name = null;

	/**
	 * @OA\Property(
	 *   type="string"
	 * )
	 */
	public $help_contents = null;

	/**
	 * @OA\Property(
	 *   type="string"
	 * )
	 */
	public $script_contents = null;

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/ActivityDefinition"
	 * )
	 */
	public $definition = null;

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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function view($activity_spec_id) {
		$_id = (new TypeID($activity_spec_id))->require([ActivitySpec::class]);
		self::authorize(function($type, $value) {
			return true; // TODO
		});
		return self::_select($_id->part(1));
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function all_by_participant($participant_id) {
		$_id = (new TypeID($participant_id))->require([Participant::class]);
		self::authorize(function($type, $value) use($participant_id) {
			return true; // TODO
		});
		return self::_select(null, $_id->part(1));
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
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
	 *   @OA\Response(response=200, ref="#/components/responses/Success"),
	 *   @OA\Response(response=403, ref="#/components/responses/Forbidden"),
	 *   @OA\Response(response=404, ref="#/components/responses/NotFound"),
	 *   @OA\Response(response=500, ref="#/components/responses/ServerFault"),
	 *   security={{"Authorization": {}}},
	 * )
	 */
	public static function all_by_researcher($researcher_id) {
		$_id = (new TypeID($researcher_id))->require([Researcher::class, Study::class]);
		self::authorize(function($type, $value) {
			return true; // TODO
		});
		return self::_select(null, $_id->part(1));
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
		return self::_select();
	}
}
