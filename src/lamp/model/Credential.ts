
/**
 * Every object can have one or more credential(s) associated with it. i.e. my_researcher.credentials = ['person A', 'person B', 'api A', 'person C', 'api B']
 */
export class Credential {
    
    /**
     * The root object this credential is attached to. The scope of this credential is limited to the object itself and any children.
     */
    origin?: string
    
    /**
     * Username or machine-readable public key (access).
     */
    accessKey?: string
    
    /**
     * SALTED HASH OF Password or machine-readable private key (secret).
     */
    secretKey?: string
    
    /**
     * The user-visible description of the credential.
     */
    description?: string
}
