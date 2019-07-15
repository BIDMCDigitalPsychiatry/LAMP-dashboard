import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { Participant } from '../model/Participant'

export class ParticipantService {
    public configuration?: Configuration

    /**
     * Get the set of all participants.
     */
    public async all(): Promise<Participant[]> {
        return (await Fetch.get<{data: any[]}>(`/participant`, this.configuration)).data.map(x => Object.assign(new Participant(), x))
    }

    /**
     * Get the set of all participants under a single researcher.
     * @param researcherId 
     */
    public async allByResearcher(researcherId: Identifier): Promise<Participant[]> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling participantAllByResearcher.')

        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/participant`, this.configuration)).data.map(x => Object.assign(new Participant(), x))
    }

    /**
     * Get the set of all participants in a single study.
     * @param studyId 
     */
    public async allByStudy(studyId: Identifier): Promise<Participant[]> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling participantAllByStudy.')

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

        return (await Fetch.post(`/study/${studyId}/participant`, participant, this.configuration))
    }

    /**
     * Delete a participant AND all owned data or event streams.
     * @param participantId 
     */
    public async delete(participantId: Identifier): Promise<Identifier> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling participantDelete.')

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

        return (await Fetch.put(`/participant/${participantId}`, participant, this.configuration))
    }

    /**
     * Get a single participant, by identifier.
     * @param participantId 
     */
    public async view(participantId: Identifier): Promise<Participant> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling participantView.')

        return (await Fetch.get<{data: any[]}>(`/participant/${participantId}`, this.configuration)).data.map(x => Object.assign(new Participant(), x))[0]
    }
}
