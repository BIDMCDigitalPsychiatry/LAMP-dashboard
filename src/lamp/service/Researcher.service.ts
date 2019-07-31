import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { Researcher } from '../model/Researcher'

export class ResearcherService {
    public configuration?: Configuration

    /**
     * Get the set of all researchers.
     */
    public async all(): Promise<Researcher[]> {
        return (await Fetch.get<{data: any[]}>(`/researcher`, this.configuration)).data.map(x => Object.assign(new Researcher(), x))
    }

    /**
     * Create a new Researcher.
     * @param researcher 
     */
    public async create(researcher: Researcher): Promise<Identifier> {
        if (researcher === null || researcher === undefined)
            throw new Error('Required parameter researcher was null or undefined when calling researcherCreate.')

        return (await Fetch.post(`/researcher`, researcher, this.configuration))
    }

    /**
     * Delete a researcher.
     * @param researcherId 
     */
    public async delete(researcherId: Identifier): Promise<Identifier> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling researcherDelete.')

        return (await Fetch.delete(`/researcher/${researcherId}`, this.configuration))
    }

    /**
     * Update a Researcher's settings.
     * @param researcherId 
     * @param body 
     */
    public async update(researcherId: Identifier, researcher: Researcher): Promise<Identifier> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling researcherUpdate.')
        if (researcher === null || researcher === undefined)
            throw new Error('Required parameter researcher was null or undefined when calling researcherUpdate.')

        return (await Fetch.put(`/researcher/${researcherId}`, researcher, this.configuration))
    }

    /**
     * Get a single researcher, by identifier.
     * @param researcherId 
     */
    public async view(researcherId: Identifier): Promise<Researcher> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling researcherView.')

        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}`, this.configuration)).data.map(x => Object.assign(new Researcher(), x))[0]
    }
}
