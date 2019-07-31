import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { ResultEvent } from '../model/ResultEvent'

export class ResultEventService {
    public configuration?: Configuration

    /**
     * Get the set of all result events produced by a  given participant, by identifier.
     * @param participantId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async allByParticipant(participantId: Identifier, origin?: string, from?: number, to?: number): Promise<ResultEvent[]> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling resultEventAllByParticipant.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        return (await Fetch.get<{data: any[]}>(`/participant/${participantId}/result_event?${queryParameters.toString()}`, this.configuration)).data.map(x => Object.assign(new ResultEvent(), x))
    }

    /**
     * Get the set of all result events produced by participants  of any study conducted by a researcher, by researcher identifier.
     * @param researcherId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async allByResearcher(researcherId: Identifier, origin?: string, from?: number, to?: number): Promise<ResultEvent[]> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling resultEventAllByResearcher.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/result_event?${queryParameters.toString()}`, this.configuration)).data.map(x => Object.assign(new ResultEvent(), x))
    }

    /**
     * Get the set of all result events produced by participants  participants of a single study, by study identifier.
     * @param studyId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async allByStudy(studyId: Identifier, origin?: string, from?: number, to?: number): Promise<ResultEvent[]> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling resultEventAllByStudy.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        return (await Fetch.get<{data: any[]}>(`/study/${studyId}/result_event?${queryParameters.toString()}`, this.configuration)).data.map(x => Object.assign(new ResultEvent(), x))
    }

    /**
     * Create a new ResultEvent for the given Participant.
     * @param participantId 
     * @param resultEvent 
     */
    public async create(participantId: Identifier, resultEvent: ResultEvent): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling resultEventCreate.')
        if (resultEvent === null || resultEvent === undefined)
            throw new Error('Required parameter resultEvent was null or undefined when calling resultEventCreate.')

        return (await Fetch.post(`/participant/${participantId}/result_event`, resultEvent, this.configuration))
    }

    /**
     * Delete a ResultEvent.
     * @param participantId 
     * @param origin 
     * @param from 
     * @param to 
     */
    public async delete(participantId: Identifier, origin?: string, from?: number, to?: number): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling resultEventDelete.')

        let queryParameters = new URLSearchParams()
        if (origin !== undefined && origin !== null)
            queryParameters.set('origin', <any>origin)
        if (from !== undefined && from !== null)
            queryParameters.set('from', <any>from)
        if (to !== undefined && to !== null)
            queryParameters.set('to', <any>to)

        return (await Fetch.delete(`/participant/${participantId}/result_event?${queryParameters.toString()}`, this.configuration))
    }
}
