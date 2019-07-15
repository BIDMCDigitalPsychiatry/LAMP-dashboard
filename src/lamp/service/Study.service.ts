import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { Study } from '../model/Study'

export class StudyService {
    public configuration?: Configuration

    /**
     * Get the set of all studies.
     */
    public async all(): Promise<Study[]> {
        return (await Fetch.get<{data: any[]}>(`/study`, this.configuration)).data.map(x => Object.assign(new Study(), x))
    }

    /**
     * Get the set of studies for a single researcher.
     * @param researcherId 
     */
    public async allByResearcher(researcherId: Identifier): Promise<Study[]> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling studyAllByResearcher.')

        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}/study`, this.configuration)).data.map(x => Object.assign(new Study(), x))
    }

    /**
     * Create a new Study for the given Researcher.
     * @param researcherId 
     * @param study 
     */
    public async create(researcherId: Identifier, study: Study): Promise<Identifier> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling studyCreate.')
        if (study === null || study === undefined)
            throw new Error('Required parameter study was null or undefined when calling studyCreate.')


        return (await Fetch.post(`/researcher/${researcherId}/study`, study, this.configuration))
    }

    /**
     * Delete a study.
     * @param studyId 
     */
    public async delete(studyId: Identifier): Promise<Identifier> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling studyDelete.')

        return (await Fetch.delete(`/study/${studyId}`, this.configuration))
    }

    /**
     * Update the study.
     * @param studyId 
     * @param study 
     */
    public async update(studyId: Identifier, study: Study): Promise<Identifier> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling studyUpdate.')
        if (study === null || study === undefined)
            throw new Error('Required parameter study was null or undefined when calling studyUpdate.')

        return (await Fetch.put(`/study/${studyId}`, study, this.configuration))
    }

    /**
     * Get a single study, by identifier.
     * @param studyId 
     */
    public async view(studyId: Identifier): Promise<Study> {
        if (studyId === null || studyId === undefined)
            throw new Error('Required parameter studyId was null or undefined when calling studyView.')

        return (await Fetch.get<{data: any[]}>(`/study/${studyId}`, this.configuration)).data.map(x => Object.assign(new Study(), x))[0]
    }
}
