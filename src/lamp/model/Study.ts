import { Identifier } from './Type'
import { Activity } from './Activity'
import { Participant } from './Participant'

/**
 *
 */
export class Study { 
    
    /**
     *
     */
    id?: Identifier

    /**
     * The name of the study.
     */
    name?: string

    /**
     * The set of all activities available in the study.
     */
    activities?: Activity[]

    /**
     * The set of all enrolled participants in the study.
     */
    participants?: Participant[]
}
