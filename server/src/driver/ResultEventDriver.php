<?php
require_once __DIR__ . '/TypeDriver.php';

trait ResultEventDriver {
	use TypeDriver;

	/**
	 * Get a set of `ResultEvent`s matching the criteria parameters.
	 */
	private static function _select(

		/**
		 * The `*ResultID` column of any `CTest_*Result` table in the LAMP v0.1 DB.
		 */
		$result_id = null,

		/**
		 * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
		 */
		$user_id = null,

		/**
		 * The `AdminID` column of the `Admin` table in the LAMP v0.1 DB.
		 */
		$admin_id = null
	) {
		$user_id = LAMP::encrypt($user_id);
		$conds = 'WHERE ' . implode(' AND ', array_filter([
				$user_id !== null ? "Users.StudyId = '$user_id'" : null,
				$admin_id !== null ? "Users.AdminID = '$admin_id'" : null
			]));
		$conds = $conds == 'WHERE ' ? '' : $conds;

		// Collect the set of legacy Activity tables and stitch the full query.
		$result = array_merge(...array_map(function($entry) use($conds) {
			$sql_if = function ($cond, $x, $y) { return $cond ? $x : $y; };

			// Perform the result lookup for every Activity table.
			$events = self::lookup("
				SELECT
	                [{$entry->IndexColumnName}] AS id,
	                DATEDIFF_BIG(MS, '1970-01-01', [{$entry->StartTimeColumnName}]) AS timestamp,
	                DATEDIFF_BIG(MS, [{$entry->StartTimeColumnName}], [{$entry->EndTimeColumnName}]) AS duration,
	                {$sql_if($entry->Slot1Name == null, '', 
	                    "[{$entry->Slot1ColumnName}] AS [static_data.{$entry->Slot1Name}],")}
	                {$sql_if($entry->Slot2Name == null, '', 
	                    "[{$entry->Slot2ColumnName}] AS [static_data.{$entry->Slot2Name}],")}
	                {$sql_if($entry->Slot3Name == null, '', 
	                    "[{$entry->Slot3ColumnName}] AS [static_data.{$entry->Slot3Name}],")}
	                {$sql_if($entry->Slot4Name == null, '', 
	                    "[{$entry->Slot4ColumnName}] AS [static_data.{$entry->Slot4Name}],")}
	                {$sql_if($entry->Slot5Name == null, '', 
	                    "[{$entry->Slot5ColumnName}] AS [static_data.{$entry->Slot5Name}],")}
	                Users.AdminID AS aid
	            FROM [{$entry->TableName}]
	            LEFT JOIN Users
	                ON [{$entry->TableName}].UserID = Users.UserID
	            {$conds};
			", 'obj');
			if (count($events) === 0)
				return [];

			// If temporal events are recorded by the activity, look all of them up as well.
			$slices = null;
			if ($entry->TemporalTableName !== null) {
				$slices = self::lookup("
	                SELECT
	                    [{$entry->TemporalTableName}].[{$entry->IndexColumnName}] AS parent_id,
	                    {$sql_if($entry->Temporal1ColumnName != null, 
	                        '[' . $entry->TemporalTableName. '].[' . $entry->Temporal1ColumnName . ']', 
	                        '(NULL)')} AS item,
	                    {$sql_if($entry->Temporal2ColumnName != null, 
	                        '[' . $entry->TemporalTableName. '].[' . $entry->Temporal2ColumnName . ']', 
	                        '(NULL)')} AS value,
	                    {$sql_if($entry->Temporal3ColumnName != null, 
	                        '[' . $entry->TemporalTableName. '].[' . $entry->Temporal3ColumnName . ']', 
	                        '(NULL)')} AS type,
	                    {$sql_if($entry->Temporal4ColumnName != null, 
	                        'CAST(CAST([' . $entry->TemporalTableName. '].[' . $entry->Temporal4ColumnName . '] AS float) * 1000 AS bigint)', 
	                        '(NULL)')} AS duration,
	                    {$sql_if($entry->Temporal5ColumnName != null, 
	                        '[' . $entry->TemporalTableName. '].[' . $entry->Temporal5ColumnName . ']', 
	                        '(NULL)')} AS level
	                FROM [{$entry->TemporalTableName}]
	                LEFT JOIN [{$entry->TableName}]
	                    ON [{$entry->TableName}].[{$entry->IndexColumnName}] = [{$entry->TemporalTableName}].[{$entry->IndexColumnName}]
		            LEFT JOIN Users
		                ON [{$entry->TableName}].UserID = Users.UserID
	                {$conds};
				", 'obj');
			}

			// Map from SQL DB to the local ResultEvent type.
			return array_map(function ($row) use ($entry, $slices) {
				$result_event = new ResultEvent();

				// Map internal ID sub-components into the single mangled ID form.
				// FIXME: Currently it's not feasible to map SurveyID from SurveyName.
				$result_event->id = new TypeID([ResultEvent::class, $entry->ActivityIndexID, $row->id]);
				$result_event->activity = new TypeID([Activity::class, $entry->ActivityIndexID, $row->aid, 0 /* SurveyID */]);
				$result_event->timestamp = intval($row->timestamp);
				$result_event->duration = intval($row->duration);

				// Copy static data fields if declared.
				$result_event->static_data = new stdClass();
				if ($entry->Slot1ColumnName != null)
					$result_event->static_data->{$entry->Slot1Name} = $row->{"static_data.{$entry->Slot1Name}"};
				if ($entry->Slot2ColumnName != null)
					$result_event->static_data->{$entry->Slot2Name} = $row->{"static_data.{$entry->Slot2Name}"};
				if ($entry->Slot3ColumnName != null)
					$result_event->static_data->{$entry->Slot3Name} = $row->{"static_data.{$entry->Slot3Name}"};
				if ($entry->Slot4ColumnName != null)
					$result_event->static_data->{$entry->Slot4Name} = $row->{"static_data.{$entry->Slot4Name}"};
				if ($entry->Slot5ColumnName != null)
					$result_event->static_data->{$entry->Slot5Name} = $row->{"static_data.{$entry->Slot5Name}"};

				// Decrypt all static data properties if known to be encrypted.
				// TODO: Encryption of fields should also be found in the ActivityIndex table!
				if (isset($result_event->static_data->survey_name))
					$result_event->static_data->survey_name = LAMP::decrypt($result_event->static_data->survey_name, true);
				if (isset($result_event->static_data->drawn_fig_file_name))
					$result_event->static_data->drawn_fig_file_name = 'https://psych.digital/LampWeb/Games/User3DFigures/' . LAMP::decrypt($result_event->static_data->drawn_fig_file_name, true);
				if (isset($raw->static_data->total_jewels_collected))
					$result_event->static_data->total_jewels_collected = LAMP::decrypt($result_event->static_data->total_jewels_collected, true);
				if (isset($result_event->static_data->total_bonus_collected))
					$result_event->static_data->total_bonus_collected = LAMP::decrypt($result_event->static_data->total_bonus_collected, true);
				if (isset($result_event->static_data->score))
					$result_event->static_data->score = LAMP::decrypt($result_event->static_data->score, true);

				// Copy all temporal events for this result event by matching parent ID.
				$result_event->temporal_events = $slices === null ? null : [];
				if ($slices !== null) {
					$result_event->temporal_events = array_values(array_map(function($slice_row) use($entry) {
						$temporal_event = new TemporalEvent();
						$temporal_event->item = $slice_row->item;
						$temporal_event->value = $slice_row->value;
						$temporal_event->type = $slice_row->type;
						$temporal_event->duration = intval($slice_row->duration);
						$temporal_event->level = $slice_row->level;

						// Special treatment for surveys with encrypted answers.
						if ($entry->ActivityIndexID === '1' /* survey */) {
							$temporal_event->item = LAMP::decrypt($temporal_event->item, true);
							$temporal_event->value = LAMP::decrypt($temporal_event->value, true);
							$temporal_event->type = strtolower($temporal_event->type);

							// Adjust the Likert scaled values to numbers.
							if (in_array($temporal_event->value, ["Not at all", "12:00AM - 06:00AM", "0-3"])) {
								$temporal_event->value = 0;
							} else if (in_array($temporal_event->value, ["Several Times", "06:00AM - 12:00PM", "3-6"])) {
								$temporal_event->value = 1;
							} else if (in_array($temporal_event->value, ["More than Half the Time", "12:00PM - 06:00PM", "6-9"])) {
								$temporal_event->value = 2;
							} else if (in_array($temporal_event->value, ["Nearly All the Time", "06:00PM - 12:00AM", ">9"])) {
								$temporal_event->value = 3;
							}
						}
						return $temporal_event;
					}, array_filter($slices, function($slice_row) use ($row) {
						return $slice_row->parent_id === $row->id;
					})));
				}

				// Finally return the newly created event.
				return $result_event;
			}, $events);
		}, self::lookup("
			SELECT * 
			FROM LAMP_Aux.dbo.ActivityIndex;
		", 'obj')));
		return count($result) === 0 ? null : $result;
	}

    /** 
     * Add a new `ResultEvent` with new fields.
     */
    private static function _insert(

        /** 
         * The `StudyId` column of the `Users` table in the LAMP v0.1 DB.
         */
        $user_id,

        /**
         * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
         */
        $activity_id,

        /**
         * The new object to append.
         */
        $new_object
    ) {
	    // Collect the set of legacy Activity tables and stitch the full query.
	    $tableset = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");
	    $tablerow = array_filter($tableset, function ($x) use ($activity_id) {
		    return $x['ActivityIndexID'] === $activity_id;
	    })[0];

	    // First consume the timestamp + duration fields that are always present.
	    // TODO: convert time!
	    $columns = [];
	    $columns[$tablerow['StartTimeColumnName']] = $new_object->static_data->timestamp;
	    $columns[$tablerow['EndTimeColumnName']] = $new_object->static_data->timestamp + $new_object->static_data->duration;

	    // We only support 5 static slots; check if they're used by the activity first.
	    foreach ([1, 2, 3, 4, 5] as $x) {
		    if ($tablerow['Slot' . $x . 'Name'] !== null) {
		    	$sql_name = $tablerow['Slot' . $x . 'ColumnName'];
		    	$obj_name = $tablerow['Slot' . $x . 'Name'];
			    $columns[$sql_name] = $new_object->static_data->{$obj_name};
		    }
	    }

	    // Convert the static array into SQL strings.
	    $static_keys = implode(', ', array_keys($columns));
	    $static_values = implode(', ', array_values($columns));

	    // Insert row, returning the generated primary key ID.
	    $result = self::lookup("
            INSERT INTO {$tablerow['TableName']} (
                {$static_keys}
            )
            OUTPUT INSERTED.{$tablerow['IndexColumnName']} AS id
			VALUES (
		        {$static_values}
			);
        ");

	    // Bail early if there was a failure to record the parent event row.
	    if (!$result) return null;
	    if ($tablerow['TemporalTableName'] === null) return $result;

	    // Now the temporal fields are mapped for each sub-event.
	    $temporals = array_map(function ($event) use($result, $tablerow) {
		    return [
			    $tablerow['TemporalIndexColumnName'] => $result['id'],
			    $tablerow['Temporal1ColumnName'] => $event->item,
			    $tablerow['Temporal2ColumnName'] => $event->value,
			    $tablerow['Temporal3ColumnName'] => $event->type,
			    $tablerow['Temporal4ColumnName'] => $event->duration,
			    $tablerow['Temporal5ColumnName'] => $event->level,
		    ];
	    }, $new_object->temporal_events);

	    // Convert the  temporal arrays into SQL strings.
	    $temporal_keys = '(' . implode(', ', array_keys($temporals[0])) . ')';
	    $temporal_values =  implode(', ', array_map(function($x) {
		    return '(' . implode(', ', array_values($x)) . ')';
	    }, $temporals));

	    // Insert sub-rows, without returning anything.
	    $result2 = self::lookup("
            INSERT INTO {$tablerow['TemporalTableName']} {$temporal_keys}
			VALUES {$temporal_values};
        ");

	    // Return the new parent row's ID.
	    return $result2 ? $result : null;
    }

	/**
	 * Update a `ResultEvent` with new fields.
	 */
	private static function _update(

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The `CTestID` column of the `CTest` table or the `SurveyID` column of
		 * the `Survey` table in the LAMP v0.1 DB.
		 */
		$type_id,

		/**
		 * The replacement object or specific fields within.
		 */
		$update_object
	) {
		// TODO: ResultEvents cannot be updated... (yet?)
		return null;
	}

	/**
	 * Deletes a `ResultEvent` row.
	 */
	private static function _delete(

		/**
		 * The `ActivityID` column of the `ActivityIndex` table in the LAMP v0.1 DB.
		 */
		$activity_id,

		/**
		 * The `CTestID` column of the `CTest` table or the `SurveyID` column of
		 * the `Survey` table in the LAMP v0.1 DB.
		 */
		$type_id
	) {
		// Collect the set of legacy Activity tables and stitch the full query.
		$tableset = self::lookup("SELECT * FROM LAMP_Aux.dbo.ActivityIndex;");
		$tablerow = array_filter($tableset, function ($x) use ($activity_id) {
			return $x['ActivityIndexID'] === $activity_id;
		})[0];

		// Set the deletion flag, without actually deleting the row.
		// TODO: Deletion is not supported! CreatedOn is not correctly used here.
		$result = self::perform("
            UPDATE {$tablerow['TableName']} SET CreatedOn = NULL WHERE {$tablerow['IndexColumnName']} = {$type_id};
        ");

		// Return whether the operation was successful.
		return $result;
	}
}
