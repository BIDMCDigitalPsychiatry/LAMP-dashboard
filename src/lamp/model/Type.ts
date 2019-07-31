
/**
 * A globally unique reference for objects.
 */
export type Identifier = string

/**
 * The UNIX Epoch date-time representation: number of milliseconds since 1/1/1970 12:00 AM.
 */
export type Timestamp = number

/**
 * Runtime type specification for each object in the LAMP platform.
 */
export interface Type {}

/**
 *
 */
export class AccessCitation { 
    
    /**
     *
     */
    _in?: string
    
    /**
     *
     */
    at?: string
    
    /**
     *
     */
    on?: Timestamp
    
    /**
     *
     */
    by?: string
}

/**
 *
 */
export class Metadata { 
    
    /**
     *
     */
    access?: AccessCitation
}

/**
 *
 */
export class Document { 
    
    /**
     *
     */
    meta?: Metadata
    
    /**
     *
     */
    data?: Array<any>
}
