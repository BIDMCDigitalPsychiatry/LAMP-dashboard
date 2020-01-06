export * from './service/index'
export * from './model/index'

import { 
    Researcher, 
    Participant 
} from './model/index'
import { 
    ActivityService, 
    ActivitySpecService, 
    CredentialService, 
    ParticipantService, 
    ResearcherService, 
    ResultEventService, 
    SensorEventService, 
    SensorSpecService, 
    StudyService, 
    TypeService 
} from './service/index'
import { Configuration } from './service/Fetch'

/**
 * 
 */
interface IAuth { 
    type: 'root' | 'researcher' | 'participant' | null; 
    id: string | null; 
    password: string | null; 
    serverAddress: string | undefined; 
}

/**
 * The root type in LAMP. You must use `LAMP.connect(...)` to begin using any LAMP classes.
 */
export default class LAMP {
    public static Activity = new ActivityService()
    public static ActivitySpec = new ActivitySpecService()
    public static Credential = new CredentialService()
    public static Participant = new ParticipantService()
    public static Researcher = new ResearcherService()
    public static ResultEvent = new ResultEventService()
    public static SensorEvent = new SensorEventService()
    public static SensorSpec = new SensorSpecService()
    public static Study = new StudyService()
    public static Type = new TypeService()
    private static get configuration(): Configuration | undefined {
        return LAMP.Type.configuration
    }
    private static set configuration(configuration: Configuration | undefined) {
        LAMP.Activity.configuration = configuration
        LAMP.ActivitySpec.configuration = configuration
        LAMP.Credential.configuration = configuration
        LAMP.Participant.configuration = configuration
        LAMP.Researcher.configuration = configuration
        LAMP.ResultEvent.configuration = configuration
        LAMP.SensorEvent.configuration = configuration
        LAMP.SensorSpec.configuration = configuration
        LAMP.Study.configuration = configuration
        LAMP.Type.configuration = configuration
    }
    


    //
    // [Credential/Identity Management]
    //



    public static Auth = class {
        public static _auth: IAuth = { type: null, id: null, password: null, serverAddress: null }
        public static _me: Researcher[] | Researcher | Participant | null | undefined

        /**
         * Authenticate/authorize as a user of a given `type`.
         * If all values are null (especially `type`), the authorization is cleared.
         */
        public static async set_identity(identity: { type: 'root' | 'researcher' | 'participant' | null; id: string | null; password: string | null; serverAddress: string | undefined; } = { type: null, id: null, password: null, serverAddress: undefined }) {
            LAMP.configuration = { base: (
                !!identity.serverAddress ? 
                    `${identity.serverAddress.startsWith('localhost') ? 
                        'http://' : 'https://'}${identity.serverAddress}` : 
                    'https://api.lamp.digital') }

            // Ensure there's actually a change to process.
            let l: IAuth = LAMP.Auth._auth || { type: null, id: null, password: null, serverAddress: null }
            if (l.type === identity.type && 
                l.id === identity.id && 
                l.password === identity.password && 
                l.serverAddress === identity.serverAddress
            ) return

            // Propogate the authorization.
            LAMP.Auth._auth = {type: identity.type, id: identity.id, password: identity.password, serverAddress: identity.serverAddress}
            LAMP.configuration = { ...(LAMP.configuration || { base: undefined, headers: undefined }), authorization: !!LAMP.Auth._auth.id ? `${LAMP.Auth._auth.id}:${LAMP.Auth._auth.password}` : undefined}

            try {

                // If we aren't clearing the credential, get the "self" identity.
                if (!!identity.type && !!identity.id && !!identity.password)
                    LAMP.Auth._me = await (identity.type === 'root' ? 
                        LAMP.Researcher.all() : (identity.type === 'researcher' ? 
                            LAMP.Researcher.view('me') : 
                            LAMP.Participant.view('me')))
            } catch(err) {

                // We failed: clear and propogate the authorization.
                LAMP.Auth._auth = { type: null, id: null, password: null, serverAddress: null }
                if (!!LAMP.configuration)
                    LAMP.configuration.authorization = undefined

                // Delete the "self" identity and throw the error we received.
                LAMP.Auth._me = null
                throw new Error('invalid id or password')
            } finally {

                // Save the authorization in sessionStorage for later.
                sessionStorage.setItem('LAMP._auth', JSON.stringify(LAMP.Auth._auth))
            }
        }

        private static async refresh_identity() {
            let _saved = JSON.parse(sessionStorage.getItem('LAMP._auth') || 'null') || LAMP.Auth._auth
            await LAMP.Auth.set_identity({ type: _saved.type, id: _saved.id, password: _saved.password, serverAddress: _saved.serverAddress })
        }
    }
}
