<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ResearcherDriver {
    use LAMPDriver;

    /** 
     * Get a set of `Researcher`s matching the criteria parameters.
     */
    private static function _select(

        /** 
         * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
         */
        $admin_id = null
    ) {
        $cond = $admin_id !== null ? "AND AdminID = '$admin_id'" : '';
        $result = self::lookup("
            SELECT 
                AdminID as id, 
                FirstName AS name, 
                LastName AS lname,
                Email AS email,
                (
                    SELECT 
                        AdminID AS id
                    FOR JSON PATH, INCLUDE_NULL_VALUES
                ) AS studies
            FROM Admin
            WHERE isDeleted = 0 {$cond}
            FOR JSON PATH, INCLUDE_NULL_VALUES;
        ", true);
        if (count($result) === 0) return null;
        
        // Map from SQL DB to the local Researcher type.
        return array_map(function($raw) {
            $obj = new Researcher();
            $obj->id = new TypeID([Researcher::class, $raw->id]);
            $obj->name = LAMP::decrypt($raw->name).' '.LAMP::decrypt(array_drop($raw, 'lname'));
            $obj->email = LAMP::decrypt($raw->email);
            $obj->studies = array_map(function($x) {
                return new TypeID([Study::class, $x->id]);
            }, $raw->studies);
            return $obj;
        }, $result);
    }

	/**
	 * Create a `Researcher` with a new object.
	 */
	private static function _insert(

		/**
		 * The new object.
		 */
		$insert_object
	) {

		// Terminate the operation if any of the required string-typed fields are not present.
		if (!is_string($insert_object->email) || !is_string($insert_object->password) || !is_string($insert_object->name))
			return null;

		// Prepare SQL row-columns from JSON object-fields.
		$email = LAMP::encrypt($insert_object->email);
		$password = LAMP::encrypt($insert_object->password, null, 'oauth');
		$names = explode(' ', $insert_object->name, 2);
		$first_name = LAMP::encrypt($names[0]);
		$last_name = LAMP::encrypt($names[1]);

		// Insert row, returning the generated primary key ID.
		$result = self::lookup("
            INSERT INTO Admin (
                Email, 
                Password, 
                FirstName, 
                LastName, 
                CreatedOn, 
                AdminType
            )
            OUTPUT INSERTED.AdminID AS id
			VALUES (
		        '{$email}',
		        '{$password}',
		        '{$first_name}',
		        '{$last_name}',
		        GETDATE(), 
		        2
			);
        ");

		// Return the new row's ID.
		return $result;
	}

	/**
	 * Update a `Researcher` with new fields.
	 */
	private static function _update(

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {

		// Terminate the operation if no valid string-typed fields are modified.
		if (!is_string($update_object->email) && !is_string($update_object->password) && !is_string($update_object->name))
			return null;

		// Prepare the minimal SQL column changes from the provided fields.
		$updates = [];
		if ($update_object->name !== null)
			array_push($updates, 'Email = \'' . LAMP::encrypt($update_object->email) . '\'');
		if ($update_object->email !== null)
			array_push($updates, 'Password = \'' . LAMP::encrypt($update_object->password, null, 'oauth') . '\'');
		if ($update_object->password !== null) {
			$names = explode(' ', $update_object->name, 2);
			array_push($updates, 'FirstName = \'' . LAMP::encrypt($names[0]) . '\'');
			array_push($updates, 'LastName = \'' . LAMP::encrypt($names[1]) . '\'');
		}
		if (count($updates) === 0)
			return null;
		$updates = implode(', ', $updates);

		// Update the specified fields on the selected Admin row.
		$result = self::perform("
            UPDATE Admin SET {$updates} WHERE AdminID = {$admin_id};
        ");

		// Return whether the operation was successful.
		return $result;
	}

	/**
	 * Delete a `Researcher` row.
	 */
	private static function _delete(

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id
	) {

		// Set the deletion flag, without actually deleting the row.
		$result = self::perform("
            UPDATE Admin SET IsDeleted = 1 WHERE AdminID = {$admin_id};
        ");

		// Return whether the operation was successful.
		return $result;
	}
}