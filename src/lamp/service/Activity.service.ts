import { Fetch, Configuration } from './Fetch'
import { Activity } from '../model/Activity'
import { Identifier } from '../model/Type'
import { Participant } from '../model/Participant'

export class ActivityService {
    public configuration?: Configuration

    /**
     * Get the set of all activities.
     */
    public async all(): Promise<Participant[]> {
        return (await Fetch.get<{data: any[]}>(`/activity`, this.configuration)).data.map(x => Object.assign(new Activity(), x))
    }

    /**
     * Get the set of all activities available to a participant,  by participant identifier.
     * @param participantId 
     */
    public async allByParticipant(participantId: Identifier): Promise<Participant[]> {
        if (participantId === null || participantId === undefined)
            throw new Error('Required parameter participantId was null or undefined when calling activityAllByParticipant.')

        return (await Fetch.get<{data: any[]}>(`/participant/${participantId}/activity`, this.configuration)).data.map(x => Object.assign(new Activity(), x))
    }

    /**
     * Get the set of all activities available to participants  of any study conducted by a researcher, by researcher identifier.
     * @param researcherId 
     */
    public async allByResearcher(researcherId: Identifier): Promise<Participant[]> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling activityAllByResearcher.')

        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/activity`, this.configuration)).data.map(x => Object.assign(new Activity(), x))
    }

    /**
     * Get the set of all activities available to  participants of a single study, by study identifier.
     * @param studyId 
     */
    public async allByStudy(studyId: Identifier): Promise<Participant[]> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling activityAllByStudy.')

        return (await Fetch.get<{data: any[]}>(`/study/${studyId}/activity`, this.configuration)).data.map(x => Object.assign(new Activity(), x))
    }

    /**
     * Create a new Activity under the given Study.
     * @param studyId 
     * @param activity 
     */
    public async create(studyId: Identifier, activity: Activity): Promise<Identifier> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling activityCreate.')
        if (activity === null || activity === undefined)
            throw new Error('Required parameter activity was null or undefined when calling activityCreate.')

        return (await Fetch.post(`/study/${studyId}/activity`, activity, this.configuration))
    }

    /**
     * Delete an Activity.
     * @param activityId 
     */
    public async delete(activityId: Identifier): Promise<Identifier> {
        if (activityId === null || activityId === undefined)
            throw new Error('Required parameter activityId was null or undefined when calling activityDelete.')

        return (await Fetch.delete(`/activity/${activityId}`, this.configuration))
    }

    /**
     * Update an Activity's settings.
     * @param activityId 
     * @param activity 
     */
    public async update(activityId: Identifier, activity: Activity): Promise<Identifier> {
        if (activityId === null || activityId === undefined)
            throw new Error('Required parameter activityId was null or undefined when calling activityUpdate.')
        if (activity === null || activity === undefined)
            throw new Error('Required parameter activity was null or undefined when calling activityUpdate.')

        return (await Fetch.put(`/activity/${activityId}`, activity, this.configuration))
    }

    /**
     * Get a single activity, by identifier.
     * @param activityId 
     */
    public async view(activityId: Identifier): Promise<Participant> {
        if (activityId === null || activityId === undefined)
            throw new Error('Required parameter activityId was null or undefined when calling activityView.')

        return (await Fetch.get<{data: any[]}>(`/activity/${activityId}`, this.configuration)).data.map(x => Object.assign(new Activity(), x))[0]
    }
}
