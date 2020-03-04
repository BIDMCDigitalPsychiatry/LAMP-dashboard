import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { SensorEvent } from '../model/SensorEvent'
import { Demo } from './Demo'

export class SensorEventService {
    public configuration?: Configuration

    /**
     * Get the set of all sensor events produced by the given participant.
     * @param participantId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async allByParticipant(participantId: Identifier, origin?: string, from?: number, to?: number): Promise<SensorEvent[]> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling sensorEventAllByParticipant.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (participantId === 'me')
                participantId = credential.length > 0 ? credential[0]['origin'] : participantId
                
            if (Demo.Participant.filter(x => x['id'] === participantId).length > 0) {
                return Promise.resolve(Demo.SensorEvent.filter(x => x['#parent'] === participantId && (!!origin ? x['spec'] === origin : true)).map(x => Object.assign(new SensorEvent(), x)))
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get<{data: any[]}>(`/participant/${participantId}/sensor_event?${queryParameters.toString()}`, this.configuration))?.data?.map(x => Object.assign(new SensorEvent(), x))
    }

    /**
     * Get the set of all sensor events produced by participants  of any study conducted by a researcher, by researcher identifier.
     * @param researcherId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async allByResearcher(researcherId: Identifier, origin?: string, from?: number, to?: number): Promise<SensorEvent[]> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling sensorEventAllByResearcher.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (researcherId === 'me')
                researcherId = credential.length > 0 ? credential[0]['origin'] : researcherId

            if (Demo.Researcher.filter(x => x['id'] === researcherId).length > 0) {
                let participants = Demo.Study.filter(x => x['#parent'] === researcherId).map(x => Demo.Participant.filter(y => y['#parent'] === x['id'])).flat(1)
                let fn = (id: string) => Demo.SensorEvent.filter(x => x['#parent'] === id && (!!origin ? x['spec'] === origin : true)).map(x => Object.assign(new SensorEvent(), x))
                return Promise.resolve(participants.reduce((all, participant) => ({ ...all, [participant['id']]: fn(participant['id']) }), {}) as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/sensor_event?${queryParameters.toString()}`, this.configuration))?.data?.map(x => Object.assign(new SensorEvent(), x))
    }

    /**
     * Get the set of all sensor events produced by participants  participants of a single study, by study identifier.
     * @param studyId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async allByStudy(studyId: Identifier, origin?: string, from?: number, to?: number): Promise<SensorEvent[]> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling sensorEventAllByStudy.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (studyId === 'me')
                studyId = credential.length > 0 ? credential[0]['origin'] : studyId

            if (Demo.Study.filter(x => x['id'] === studyId).length > 0) {
                let participants = Demo.Participant.filter(x => x['#parent'] === studyId)
                let fn = (id: string) => Demo.SensorEvent.filter(x => x['#parent'] === id && (!!origin ? x['spec'] === origin : true)).map(x => Object.assign(new SensorEvent(), x))
                return Promise.resolve(participants.reduce((all, participant) => ({ ...all, [participant['id']]: fn(participant['id']) }), {}) as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get<{data: any[]}>(`/study/${studyId}/sensor_event?${queryParameters.toString()}`, this.configuration))?.data?.map(x => Object.assign(new SensorEvent(), x))
    }

    /**
     * Create a new SensorEvent for the given Participant.
     * @param participantId 
     * @param sensorEvent 
     */
    public async create(participantId: Identifier, sensorEvent: SensorEvent): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling sensorEventCreate.')
        if (sensorEvent === null || sensorEvent === undefined)
            throw new Error('Required parameter sensorEvent was null or undefined when calling sensorEventCreate.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (participantId === 'me')
                participantId = credential.length > 0 ? credential[0]['origin'] : participantId

            if (Demo.Participant.filter(x => x['id'] === participantId).length > 0) {
                Demo.SensorEvent.push({
                    "#type": "ActivityEvent",
                    "#parent": participantId,
                    ...sensorEvent as any
                })
                return Promise.resolve({} as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.post(`/participant/${participantId}/sensor_event`, sensorEvent, this.configuration))
    }

    /**
     * Delete a sensor event.
     * @param participantId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async delete(participantId: Identifier, origin?: string, from?: number, to?: number): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling sensorEventDelete.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

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
        return (await Fetch.delete(`/participant/${participantId}/sensor_event?${queryParameters.toString()}`, this.configuration))
    }
}
