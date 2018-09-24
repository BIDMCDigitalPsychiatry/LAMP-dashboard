<?php
require_once __DIR__ . '/LAMPDriver.php';

trait ResearcherDriverGET_v0_1 {
    use LAMPDriver_v0_1;

    /** 
     * Get a set of `Researcher`s matching the criteria parameters.
     */
    private static function _get(

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
            $obj->id = new LAMPID([Researcher::class, $raw->id]);
            $obj->name = LAMP::decrypt($raw->name).' '.LAMP::decrypt(array_drop($raw, 'lname'));
            $obj->email = LAMP::decrypt($raw->email);
            $obj->studies = array_map(function($x) {
                return new LAMPID([Study::class, $x->id]);
            }, $raw->studies);
            return $obj;
        }, $result);
    }
}

trait ResearcherDriverSET_v0_1 {
    use LAMPDriver_v0_1;

    /** 
     * Create or update a `Researcher` with new fields.
     */
    private static function _set(

        /** 
         * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
         */
        $admin_id = null,

        /**
         * The new object or patch fields of an object.
         */
        $update_object = null
    ) {
        if ($admin_id === null && $update_object !== null) { /* create */
            // OUTPUT INSERTED.AdminID
        } else if ($admin_id !== null && $update_object !== null) { /* update */
            //
        } else { /* delete */
            //
        }
        return null;
    }
}