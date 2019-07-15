import { Identifier } from './Type'

/**
 *
 */
export class DynamicAttachment {
    
    /**
     * The key.
     */
    key?: string
    
    /**
     *
     */
    from?: Identifier
    
    /**
     * Either \"me\" to apply to the attachment owner only, the ID of an object owned  by the attachment owner, or a string representing the child object type to apply to.
     */
    to?: string
    
    /**
     * The API triggers that activate script execution. These will be event stream types or object types in the API, or, if scheduling execution periodically, a cron-job string prefixed with \"!\" (exclamation point).
     */
    triggers?: Array<any>
    
    /**
     * The script language.
     */
    language?: string
    
    /**
     * The script contents.
     */
    contents?: string
    
    /**
     * The script requirements.
     */
    requirements?: Array<any>
}
