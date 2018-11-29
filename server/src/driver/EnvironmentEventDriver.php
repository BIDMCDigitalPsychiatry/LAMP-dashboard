<?php
require_once __DIR__ . '/TypeDriver.php';

trait EnvironmentEventDriver {
	use TypeDriver;

    /** 
     * Get a set of `EnvironmentEvent`s matching the criteria parameters.
     */
    private static function _select(

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
        ", 'json');
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

    /** 
     * Add a new `EnvironmentEvent` with new fields.
     */
    private static function _insert(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id,

        /**
         * The new object to append.
         */
        $new_object
    ) {

	    // Terminate the operation if no valid coordinates are found.
	    if (!isset($new_object->coordinates[0]) || !isset($new_object->coordinates[1]) ||
		    !isset($new_object->accuracy))
	    	return null;

	    // If a location or social context is provided, map them back to the original strings.
	    $loc_name = 'i am';
	    if (isset($new_object->location_context)) {
		    if ($new_object->location_context == LocationContext::Home) {
			    $loc_name .= ' home';
		    } else if ($new_object->location_context == LocationContext::School) {
			    $loc_name .= ' in school/class';
		    } else if ($new_object->location_context == LocationContext::Work) {
			    $loc_name .= ' at work';
		    } else if ($new_object->location_context == LocationContext::Hospital) {
			    $loc_name .= ' in clinic/hospital';
		    } else if ($new_object->location_context == LocationContext::Outside) {
			    $loc_name .= ' outside';
		    } else if ($new_object->location_context == LocationContext::Shopping) {
			    $loc_name .= ' shopping/dining';
		    } else if ($new_object->location_context == LocationContext::Transit) {
			    $loc_name .= ' in bus/train/car';
		    }
	    }
	    if (isset($new_object->social_context)) {
		    if ($new_object->social_context == SocialContext::Alone) {
			    $loc_name .= ' alone';
		    } else if ($new_object->social_context == SocialContext::Friends) {
			    $loc_name .= ' with friends';
		    } else if ($new_object->social_context == SocialContext::Family) {
			    $loc_name .= ' with family';
		    } else if ($new_object->social_context == SocialContext::Peers) {
			    $loc_name .= ' with peers';
		    } else if ($new_object->social_context == SocialContext::Crowd) {
			    $loc_name .= ' in crowd';
		    }
	    }
	    $loc_name = LAMP::encrypt($loc_name);

	    // Prepare the minimal SQL column changes from the provided fields.
	    $user_id = LAMP::encrypt($user_id);
	    $lat = LAMP::encrypt("" . $new_object->coordinates[0]);
	    $long = LAMP::encrypt("" . $new_object->coordinates[1]);
	    $type = (isset($new_object->location_context) || isset($new_object->social_context)) ? 2 : 1;

	    // Insert row, returning the generated primary key ID.
	    $result = self::lookup("
            INSERT INTO Locations (
                UserID,
                LocationName, 
                CreatedOn, 
                Type, 
                Latitude, 
                Longitude
            )
            OUTPUT INSERTED.LocationID AS id
			VALUES (
		        '{$user_id}',
		        '{$loc_name}',
		        DATEADD(MS, {$new_object->timestamp}, '1970-01-01'), 
		        {$type},
		        '{$lat}',
		        '{$long}'
			);
        ");

	    // Return the new row's ID.
	    return $result;
    }

	/**
	 * Update an `EnvironmentEvent` with new fields.
	 */
	private static function _update(

		/**
		 * The `LocationID` column of the `Locations` table in the LAMP v0.1 DB.
		 */
		$location_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {

		// Terminate the operation if no valid fields are updated.
		if (!isset($update_object->accuracy) &&
			!isset($update_object->coordinates[0]) && !isset($update_object->coordinates[1]) &&
			!isset($update_object->location_context) && !isset($update_object->social_context))
			return null;

		// If a location or social context is provided, map them back to the original strings.
		// TODO: Cannot update EITHER location OR social, must update BOTH together!
		$loc_name = 'i am';
		if (isset($update_object->location_context)) {
			if ($update_object->location_context == LocationContext::Home) {
				$loc_name .= ' home';
			} else if ($update_object->location_context == LocationContext::School) {
				$loc_name .= ' in school/class';
			} else if ($update_object->location_context == LocationContext::Work) {
				$loc_name .= ' at work';
			} else if ($update_object->location_context == LocationContext::Hospital) {
				$loc_name .= ' in clinic/hospital';
			} else if ($update_object->location_context == LocationContext::Outside) {
				$loc_name .= ' outside';
			} else if ($update_object->location_context == LocationContext::Shopping) {
				$loc_name .= ' shopping/dining';
			} else if ($update_object->location_context == LocationContext::Transit) {
				$loc_name .= ' in bus/train/car';
			}
		}
		if (isset($update_object->social_context)) {
			if ($update_object->social_context == SocialContext::Alone) {
				$loc_name .= ' alone';
			} else if ($update_object->social_context == SocialContext::Friends) {
				$loc_name .= ' with friends';
			} else if ($update_object->social_context == SocialContext::Family) {
				$loc_name .= ' with family';
			} else if ($update_object->social_context == SocialContext::Peers) {
				$loc_name .= ' with peers';
			} else if ($update_object->social_context == SocialContext::Crowd) {
				$loc_name .= ' in crowd';
			}
		}

		// Prepare the minimal SQL column changes from the provided fields.
		$updates = [];
		if ($loc_name !== 'i am')
			array_push($updates, 'LocationName = \'' . LAMP::encrypt($loc_name) . '\'');
		array_push($updates, 'Type = ' . (($loc_name !== 'i am') ? 2 : 1));
		if ($update_object->timestamp)
			array_push($updates, "CreatedOn = DATEADD(MS, {$update_object->timestamp}, \'1970-01-01\')");
		if (isset($update_object->coordinates[0]))
			array_push($updates, 'Latitude = \'' . LAMP::encrypt("" . $update_object->coordinates[0]) . '\'');
		if (isset($update_object->coordinates[1]))
			array_push($updates, 'Longitude = \'' . LAMP::encrypt("" . $update_object->coordinates[1]) . '\'');
		if (count($updates) === 0)
			return null;
		$updates = implode(', ', $updates);

		// Insert row, returning the generated primary key ID.
		$result = self::lookup("
            UPDATE Locations SET {$updates} WHERE LocationID = {$location_id}; 
        ");

		// Return whether the operation was successful.
		return $result;
	}

	/**
	 * Deletes an `EnvironmentEvent` row.
	 */
	private static function _delete(

		/**
		 * The `LocationID` column of the `Locations` table in the LAMP v0.1 DB.
		 */
		$location_id
	) {

		// Set the deletion flag, without actually deleting the row.
		// TODO: Deletion is not supported! Type is not correctly used here.
		$result = self::perform("
            UPDATE Locations SET Type = 0 WHERE LocationID = {$location_id};
        ");

		// Return whether the operation was successful.
		return $result;
	}
}
