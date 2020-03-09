import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { Participant } from '../model/Participant'
import { Demo } from './Demo'

export class ParticipantService {
    public configuration?: Configuration

    /**
     * Get the set of all participants.
     */
    public async all(): Promise<Participant[]> {
        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            
            return Promise.resolve(Demo.Participant.map(x => Object.assign(new Participant(), x)))
        }
        return (await Fetch.get<{data: any[]}>(`/participant`, this.configuration)).data.map(x => Object.assign(new Participant(), x))
    }

    /**
     * Get the set of all participants under a single researcher.
     * @param researcherId 
     */
    public async allByResearcher(researcherId: Identifier): Promise<Participant[]> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling participantAllByResearcher.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (researcherId === 'me')
                researcherId = credential.length > 0 ? credential[0]['origin'] : researcherId
            
            if (Demo.Researcher.filter(x => x['id'] === researcherId).length > 0) {
                return Promise.resolve(Demo.Participant.filter(x => Demo.Study.filter(y => y['#parent'] === researcherId).map(y => y['id']).includes(x['#parent'])).map(x => Object.assign(new Participant(), x)))
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/participant`, this.configuration)).data.map(x => Object.assign(new Participant(), x))
    }

    /**
     * Get the set of all participants in a single study.
     * @param studyId 
     */
    public async allByStudy(studyId: Identifier): Promise<Participant[]> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling participantAllByStudy.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (studyId === 'me')
                studyId = credential.length > 0 ? credential[0]['origin'] : studyId
                
            if (Demo.Study.filter(x => x['id'] === studyId).length > 0) {
                return Promise.resolve(Demo.Participant.filter(x => x['#parent'] === studyId).map(x => Object.assign(new Participant(), x)))
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get<{data: any[]}>(`/study/${studyId}/participant`, this.configuration)).data.map(x => Object.assign(new Participant(), x))
    }

    /**
     * Create a new Participant for the given Study.
     * @param studyId 
     * @param participant 
     */
    public async create(studyId: Identifier, participant: Participant): Promise<Identifier> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling participantCreate.')
        if (participant === null || participant === undefined)
            throw new Error('Required parameter participant was null or undefined when calling participantCreate.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (studyId === 'me')
                studyId = credential.length > 0 ? credential[0]['origin'] : studyId

            if (Demo.Study.filter(x => x['id'] === studyId).length > 0) {
                let data = {
                    "#type": "Participant",
                    "#parent": studyId,
                    "id": "U" + Math.random().toString().substring(2, 11),
                    "language": "en",
                    "theme": "#359FFE",
                    "emergency_contact": null,
                    "helpline": null
                }
                Demo.Participant.push(data)
                return Promise.resolve({ data: data['id'] } as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.post(`/study/${studyId}/participant`, participant, this.configuration))
    }

    /**
     * Delete a participant AND all owned data or event streams.
     * @param participantId 
     */
    public async delete(participantId: Identifier): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling participantDelete.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO 
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (participantId === 'me')
                participantId = credential.length > 0 ? credential[0]['origin'] : participantId

            let idx = Demo.Participant.findIndex(x => x['id'] === participantId)
            if (idx >= 0) {
                Demo.Participant.splice(idx, 1)
                Demo.ActivityEvent = Demo.ActivityEvent.filter(x => x['#parent'] !== participantId)
                Demo.SensorEvent = Demo.SensorEvent.filter(x => x['#parent'] !== participantId)
                Demo.Credential = Demo.Credential.filter(x => x['#parent'] !== participantId)
                Demo.Tags = Demo.Tags.filter(x => x['#parent'] !== participantId && x['target'] !== participantId)
                return Promise.resolve({} as any)
            } else {
                return Promise.resolve({ "error": "404.not-found" } as any)
            }
        }
        return (await Fetch.delete(`/participant/${participantId}`, this.configuration))
    }

    /**
     * Update a Participant's settings.
     * @param participantId 
     * @param participant 
     */
    public async update(participantId: Identifier, participant: Participant): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling participantUpdate.')
        if (participant === null || participant === undefined)
            throw new Error('Required parameter participant was null or undefined when calling participantUpdate.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (participantId === 'me')
                participantId = credential.length > 0 ? credential[0]['origin'] : participantId

            if (Demo.Participant.filter(x => x['id'] === participantId).length > 0) {
                return Promise.resolve({ 'error': '500.demo-restriction' } as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.put(`/participant/${participantId}`, participant, this.configuration))
    }

    /**
     * Get a single participant, by identifier.
     * @param participantId 
     */
    public async view(participantId: Identifier): Promise<Participant> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling participantView.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (participantId === 'me')
                participantId = credential.length > 0 ? credential[0]['origin'] : participantId

            let data = Demo.Participant.filter(x => x['id'] === participantId).map(x => Object.assign(new Participant(), x))
            return Promise.resolve(data.length > 0 ? data[0] : { 'error': '404.not-found' } as any)
        }
        return (await Fetch.get<{data: any[]}>(`/participant/${participantId}`, this.configuration)).data.map(x => Object.assign(new Participant(), x))[0]
    }
}
