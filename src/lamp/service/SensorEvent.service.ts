import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { SensorEvent } from '../model/SensorEvent'

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

        return (await Fetch.get<{data: any[]}>(`/participant/${participantId}/sensor_event?${queryParameters.toString()}`, this.configuration)).data.map(x => Object.assign(new SensorEvent(), x))
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

        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/sensor_event?${queryParameters.toString()}`, this.configuration)).data.map(x => Object.assign(new SensorEvent(), x))
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

        return (await Fetch.get<{data: any[]}>(`/study/${studyId}/sensor_event?${queryParameters.toString()}`, this.configuration)).data.map(x => Object.assign(new SensorEvent(), x))
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

        return (await Fetch.delete(`/participant/${participantId}/sensor_event?${queryParameters.toString()}`, this.configuration))
    }
}
