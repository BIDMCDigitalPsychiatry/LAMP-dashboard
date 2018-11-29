<?php
require_once __DIR__ . '/TypeDriver.php';

trait MetadataEventDriver {
	use TypeDriver;

	/**
	 * Get a set of `MetadataEvent`s matching the criteria parameters.
	 */
	private static function _select(

		/**
		 * The `?` column of the `?` table in the LAMP_Aux DB.
		 */
		$metadata_id = null,

		/**
		 * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
		 */
		$user_id = null
	) {
		return null; // TODO
	}

	/**
	 * Create a `MetadataEvent` with a new object.
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
	 * Update a `MetadataEvent` with new fields.
	 */
	private static function _update(

		/**
		 * The `?` column of the `?` table in the LAMP_Aux DB.
		 */
		$metadata_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {
		return null; // TODO
	}

	/**
	 * Delete a `MetadataEvent` row.
	 */
	private static function _delete(

		/**
		 * The `?` column of the `?` table in the LAMP_Aux DB.
		 */
		$metadata_id
	) {
		return null; // TODO
	}
}