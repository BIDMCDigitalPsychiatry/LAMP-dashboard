<?php
require_once __DIR__ . '/LAMPDriver.php';

trait EnvironmentEventDriverGET_v0_1 {
	use LAMPDriver_v0_1;

    /** 
     * Get a set of `EnvironmentEvent`s matching the criteria parameters.
     */
    private static function _get(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id = null, 

        /** 
         * The `AdminID` column of the `Users` table in the LAMP v0.1 DB.
         */
        $admin_id = null, 

        /** 
         * The `LocationID` column of the `Locations` table in the LAMP v0.1 DB.
         */
        $location_id = null
    ) {
        $user_id = LAMP::encrypt($user_id);
        $cond1 = $location_id !== null ? "AND LocationID = '{$location_id}'" : '';
        $cond2 = $user_id !== null ? "AND Users.StudyId = '{$user_id}'" : '';
        $cond3 = $admin_id !== null ? "AND Users.AdminID = '{$admin_id}'" : '';
        $result = self::lookup("
            SELECT 
                LocationID AS id, 
                (NULL) AS attachments, 
                DATEDIFF_BIG(MS, '1970-01-01', Locations.CreatedOn) AS [timestamp],
                (CASE 
                    WHEN Coordinates IS NOT NULL THEN Coordinates
                    ELSE Locations.Address
                END) AS coordinates,
                (CASE 
                    WHEN Coordinates IS NULL THEN NULL
                    ELSE 1
                END) AS accuracy,
                (NULL) AS location_context,
                (NULL) AS social_context,
                Type AS type,
                LocationName AS location_name 
            FROM Locations
            LEFT JOIN Users
                ON Locations.UserID = Users.UserID
            LEFT JOIN LAMP_Aux.dbo.GPSLookup 
                ON Locations.Address = LAMP_Aux.dbo.GPSLookup.Address
            WHERE IsDeleted = 0 
                {$cond1}
                {$cond2}
                {$cond3}
            FOR JSON PATH, INCLUDE_NULL_VALUES;
        ", true);
        if (count($result) == 0) 
            return null;
        
        // Map from SQL DB to the local EnvironmentEvent type.
        foreach($result as &$obj) {
            $_type = array_drop($obj, 'type');
            $_name = array_drop($obj, 'location_name');

            $obj->id = new TypeID([EnvironmentEvent::class, $obj->id]);
            $obj->coordinates = LAMP::decrypt($obj->coordinates, true);

            // Extract the location and social contexts from the name.
            if ($_type != 2) continue;
            $matches = [];
            preg_match('/(?:i am )([ \S\/]+)(alone|in [ \S\/]*|with [ \S\/]*)/', 
                       strtolower(LAMP::decrypt($_name, true)), $matches);
            if (count($matches) > 1) {
                if ($matches[1] == 'home ') {
                    $obj->location_context = LocationContext::Home;
                } else if ($matches[1] == 'in school/class ') {
                    $obj->location_context = LocationContext::School;
                } else if ($matches[1] == 'at work ') {
                    $obj->location_context = LocationContext::Work;
                } else if ($matches[1] == 'in clinic/hospital ') {
                    $obj->location_context = LocationContext::Hospital;
                } else if ($matches[1] == 'outside ') {
                    $obj->location_context = LocationContext::Outside;
                } else if ($matches[1] == 'shopping/dining ') {
                    $obj->location_context = LocationContext::Shopping;
                } else if ($matches[1] == 'in bus/train/car ') {
                    $obj->location_context = LocationContext::Transit;
                }
            }
            if (count($matches) > 2) {
                if ($matches[2] == 'alone') {
                    $obj->social_context = SocialContext::Alone;
                } else if ($matches[2] == 'with friends') {
                    $obj->social_context = SocialContext::Friends;
                } else if ($matches[2] == 'with family') {
                    $obj->social_context = SocialContext::Family;
                } else if ($matches[2] == 'with peers') {
                    $obj->social_context = SocialContext::Peers;
                } else if ($matches[2] == 'in crowd') {
                    $obj->social_context = SocialContext::Crowd;
                }
            }
        }
        return $result;
    }
}

trait EnvironmentEventDriverSET_v0_1 {
    use LAMPDriver_v0_1;

    /** 
     * Add a new `EnvironmentEvent` with new fields.
     */
    private static function _add(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id = null, 

        /**
         * The new object to append.
         */
        $new_object = null
    ) {
        // OUTPUT INSERTED.LocationID
        return null;
    }
}
