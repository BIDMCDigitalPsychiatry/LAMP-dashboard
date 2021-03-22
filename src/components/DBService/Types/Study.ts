/**
 *
 */
export class Study {
  /**
   *
   */
  id?: string

  /**
   * The name of the study.
   */
  name?: string

  /**
   * Schedule
   */
  schedule: Array<JSON>

  /**
   * Settings
   */
  settings: Array<JSON>

  /**
   * Activity spec
   */
  spec: string

  /**
   * Study id
   */
  study_id: string

  /**
   * Study name
   */
  study_name: string
}
