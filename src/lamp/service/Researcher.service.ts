import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { Researcher } from '../model/Researcher'
import { Demo } from './Demo'

export class ResearcherService {
    public configuration?: Configuration

    /**
     * Get the set of all researchers.
     */
    public async all(): Promise<Researcher[]> {
        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            
            return Promise.resolve(Demo.Researcher.map(x => Object.assign(new Researcher(), x)))
        }
        return (await Fetch.get<{data: any[]}>(`/researcher`, this.configuration)).data.map(x => Object.assign(new Researcher(), x))
    }

    /**
     * Create a new Researcher.
     * @param researcher 
     */
    public async create(researcher: Researcher): Promise<Identifier> {
        if (researcher === null || researcher === undefined)
            throw new Error('Required parameter researcher was null or undefined when calling researcherCreate.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.post(`/researcher`, researcher, this.configuration))
    }

    /**
     * Delete a researcher.
     * @param researcherId 
     */
    public async delete(researcherId: Identifier): Promise<Identifier> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling researcherDelete.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
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

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.put(`/researcher/${researcherId}`, researcher, this.configuration))
    }

    /**
     * Get a single researcher, by identifier.
     * @param researcherId 
     */
    public async view(researcherId: Identifier): Promise<Researcher> {
        if (researcherId === null || researcherId === undefined)
            throw new Error('Required parameter researcherId was null or undefined when calling researcherView.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (researcherId === 'me')
                researcherId = credential.length > 0 ? credential[0]['origin'] : researcherId
            
            let data = Demo.Researcher.filter(x => x['id'] === researcherId).map(x => Object.assign(new Researcher(), x))
            return Promise.resolve(data.length > 0 ? data[0] : { 'error': '404.not-found' } as any)
        }
        return (await Fetch.get<{data: any[]}>(`/researcher/${researcherId}`, this.configuration)).data.map(x => Object.assign(new Researcher(), x))[0]
    }
}
