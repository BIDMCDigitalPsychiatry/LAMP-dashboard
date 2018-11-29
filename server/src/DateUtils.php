<?php

/**
 * @OA\Schema(
 *   schema="Timestamp",
 *   type="integer",
 *   format="int64"
 * )
 */

/**
 * @OA\Schema()
 */
class CalendarComponents extends LAMP {

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $year = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $month = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $day = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $hour = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $minute = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $second = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $millisecond = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $weekday = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $ordinal = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $week_of_month = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $week_of_year = null;

	/**
	 * Create a new CalendarComponents object.
	 */
	public function __construct($year = null, $month = null, $day = null, $hour = null, $minute = null, $second = null, $millisecond = null, $weekday = null, $ordinal = null, $week_of_month = null, $week_of_year = null) {
		$this->year = $year;
		$this->month = $month;
		$this->day = $day;
		$this->hour = $hour;
		$this->minute = $minute;
		$this->second = $second;
		$this->millisecond = $millisecond;
		$this->weekday = $weekday;
		$this->ordinal = $ordinal;
		$this->week_of_month = $week_of_month;
		$this->week_of_year = $week_of_year;
	}
}

/**
 * @OA\Schema()
 */
class DurationInterval extends LAMP {

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/Timestamp"
	 * )
	 */
	public $start = null;

	/**
	 * @OA\Property(
	 *   type="array",
	 *   @OA\Items(ref="#/components/schemas/CalendarComponents")
	 * )
	 */
	public $interval = null;

	/**
	 * @OA\Property(
	 *   type="integer",
	 *   format="int64"
	 * )
	 */
	public $repeat_count = null;

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/Timestamp"
	 * )
	 */
	public $end = null;

	/**
	 * Create a new DurationInterval object.
	 */
	public function __construct($start = null, $interval = null, $repeat_count = null, $end = null) {
		$this->start = $start;
		$this->interval = $interval;
		$this->repeat_count = $repeat_count;
		$this->end = $end;
	}
}

/**
 * @OA\Schema(
 *   type="string",
 *   enum={
 *     "hourly",
 *     "every3h",
 *     "every6h",
 *     "every12h",
 *     "daily",
 *     "biweekly",
 *     "triweekly",
 *     "weekly",
 *     "bimonthly",
 *     "monthly",
 *     "custom",
 *     "none"
 *   },
 *   description="The repeat type of a schedule.",
 * )
 */
abstract class RepeatTypeLegacy extends LAMP {
	const hourly = 'hourly';
	const every3h = 'every3h';
	const every6h = 'every6h';
	const every12h = 'every12h';
	const daily = 'daily';
	const biweekly = 'biweekly';
	const triweekly = 'triweekly';
	const weekly = 'weekly';
	const bimonthly = 'bimonthly';
	const monthly = 'monthly';
	const custom = 'custom';
	const none = 'none';
}

/**
 * @OA\Schema()
 */
class DurationIntervalLegacy extends LAMP {

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/RepeatTypeLegacy"
	 * )
	 */
	public $repeat_type = null;

	/**
	 * @OA\Property(
	 *   ref="#/components/schemas/Timestamp"
	 * )
	 */
	public $date = null;

	/**
	 * @OA\Property(
	 *   type="array",
	 *   @OA\Items(ref="#/components/schemas/Timestamp")
	 * )
	 */
	public $custom_times = null;

	/**
	 * Create a new DurationIntervalLegacy object.
	 */
	public function __construct($repeat_type = null, $date = null, $custom_times = null) {
		$this->repeat_type = $repeat_type;
		$this->date = $date;
		$this->custom_times = $custom_times;
	}
}
