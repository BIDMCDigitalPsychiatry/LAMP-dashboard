import { Identifier } from './Type'

/**
 * A participant within a study a participant cannot be enrolled in  more than one study at a time.
 */
export class Participant {
    
    /**
     *
     */ 
    id?: Identifier
    
    /**
     * The researcher-provided study code for the participant.
     */
    studyCode?: string
    
    /**
     * The participant's selected language code for the LAMP app.
     */
    language?: string
    
    /**
     * The participant's selected theme for the LAMP app.
     */
    theme?: string
    
    /**
     * The participant's emergency contact number.
     */
    emergencyContact?: string
    
    /**
     * The participant's selected personal helpline number.
     */
    helpline?: string
}
