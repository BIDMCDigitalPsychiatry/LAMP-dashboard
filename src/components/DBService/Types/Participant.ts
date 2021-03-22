/**
 *
 */
export class Participant {
  /**
   *
   */
  id?: string

  /**
   * The name of the study.
   */
  name?: string

  /**
   * GPS
   */
  gps: Array<JSON>

  /**
   * Accelerometer
   */
  accelerometer: Array<JSON>

  /**
   * Active
   */
  active: Array<JSON>

  /**
   * Analytics
   */
  analytics: Array<JSON>

  /**
   * Study id
   */
  study_id: string

  /**
   * Study name
   */
  study_name: string
}
