<?php
require_once __DIR__ . '/TypeDriver.php';

trait SensorEventDriver {
	use TypeDriver;

	/**
	 * Get a set of `SensorEvent`s matching the criteria parameters.
	 */
	private static function _select(

		/**
		 * The `?` column of the `?` table in the LAMP_Aux DB.
		 */
		$sensor_id = null,

		/**
		 * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
		 */
		$user_id = null
	) {
		return null; // TODO
	}

	/**
	 * Create a `SensorEvent` with a new object.
	 */
	private static function _insert(

		/**
		 * The new object.
		 */
		$insert_object
	) {
		return null; // TODO
	}

	/**
	 * Update a `SensorEvent` with new fields.
	 */
	private static function _update(

		/**
		 * The `?` column of the `?` table in the LAMP_Aux DB.
		 */
		$sensor_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {
		return null; // TODO
	}

	/**
	 * Delete a `SensorEvent` row.
	 */
	private static function _delete(

		/**
		 * The `?` column of the `?` table in the LAMP_Aux DB.
		 */
		$sensor_id
	) {
		return null; // TODO
	}
}