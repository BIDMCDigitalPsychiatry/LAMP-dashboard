<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ActivitySpecDriver {
	use LAMPDriver;

	/**
	 * Get a set of `ActivitySpec`s matching the criteria parameters.
	 */
	private static function _select(

		/**
		 * The `ActivityIndexID` column of the `ActivityIndex` table in the LAMP_Aux DB.
		 */
		$index_id = null,

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id = null
	) {

		// Collect the set of legacy Activity tables and stitch the full query.
		$activities_list = self::lookup("
			SELECT 
	        	ActivityIndexID AS id,
	        	Name AS name
			FROM LAMP_Aux.dbo.ActivityIndex;
		");

		// Convert fields correctly and return the spec objects.
		return array_map(function($x) {
			$obj = new ActivitySpec();
			$obj->id = new TypeID([ActivitySpec::class, $x['id']]);
			$obj->name = $x['name'];
			return $obj;
		}, $activities_list);
	}

	/**
	 * Create a `ActivitySpec` with a new object.
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
	 * Update a `ActivitySpec` with new fields.
	 */
	private static function _update(

		/**
		 * The `ActivityIndexID` column of the `ActivityIndex` table in the LAMP_Aux DB.
		 */
		$index_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {
		return null; // TODO
	}

	/**
	 * Delete a `ActivitySpec` row.
	 */
	private static function _delete(

		/**
		 * The `ActivityIndexID` column of the `ActivityIndex` table in the LAMP_Aux DB.
		 */
		$index_id
	) {
		return null; // TODO
	}
}