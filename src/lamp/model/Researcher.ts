import { Identifier } from './Type'
import { Study } from './Study'

/**
 *
 */
export class Researcher { 
    
    /**
     *
     */
    id?: Identifier
    
    /**
     * The name of the researcher.
     */
    name?: string
    
    /**
     * The email address of the researcher.
     */
    email?: string
    
    /**
     * The physical address of the researcher.
     */
    address?: string
    
    /**
     * The set of all studies conducted by the researcher.
     */
    studies?: Study[]
}
