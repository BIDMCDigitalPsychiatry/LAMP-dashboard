<?php
require_once __DIR__ . '/TypeDriver.php';

/**
 * !!!!!!!!!!!!!!!!!!!!!!!
 * !!! CRITICAL NOTICE !!!
 * !!!!!!!!!!!!!!!!!!!!!!!
 *
 * All Driver code used in LAMP requires two assumptions to hold true *ALWAYS*!
 *     (1) ActivitySpec ID:0 belongs to "Activity Group".
 *     (2) ActivitySpec ID:1 belongs to "Survey".
 * If these two conditions are not satisfied, *ALL DATA INTEGRITY IS LOST*!
 *
 * !!!!!!!!!!!!!!!!!!!!!!!
 * !!! CRITICAL NOTICE !!!
 * !!!!!!!!!!!!!!!!!!!!!!!
 */

trait ActivitySpecDriver {
	use TypeDriver;

	/**
	 * The ActivitySpec with ID = 0 is specially known as the "batch spec."
	 */
	private static function _batchSpec() {
		static $_obj = null;
		if ($_obj === null) {
			$_obj = new ActivitySpec();
			$_obj->id = new TypeID([ActivitySpec::class, 0]);
			$_obj->name = 'Activity Group';
			$_obj->definition = new ActivityDefinition();
			$_obj->definition->settings = [
				[
					'name' => 'item1', /* static for now */
					'type' => 'string', /* switch to schema format */
					'default' => null, /* null vs. 'null' */
				],
				[
					'name' => 'item2',
					'type' => 'string',
					'default' => null,
				],
				[
					'name' => 'item3',
					'type' => 'string',
					'default' => null,
				]
			];
		}
		return $_obj;
	}

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
		// Short-circuit to the batch spec if requested.
		if ($index_id === 0) return self::_batchSpec();

		// Collect the set of legacy Activity tables and stitch the full query.
		$cond = $index_id !== null ? "WHERE ActivityIndexID = $index_id" : '';
		$activities_list = self::lookup("
			SELECT 
	        	ActivityIndexID AS id,
	        	Name AS name
			FROM LAMP_Aux.dbo.ActivityIndex
			{$cond};
		");

		// Convert fields correctly and return the spec objects.
		return array_merge([
			self::_batchSpec() // don't forget!
		], array_map(function($x) {
			$obj = new ActivitySpec();
			$obj->id = new TypeID([ActivitySpec::class, $x['id']]);
			$obj->name = $x['name'];
			return $obj;
		}, $activities_list));
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
		// TODO: ActivitySpecs do not exist! They cannot be modified!
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
		// TODO: ActivitySpecs do not exist! They cannot be modified!
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
		// TODO: ActivitySpecs do not exist! They cannot be modified!
		return null; // TODO
	}
}