import { Fetch, Configuration } from './Fetch'
import { ActivitySpec } from '../model/ActivitySpec'
import { Identifier } from '../model/Type'
import { Demo } from './Demo'

export class ActivitySpecService {
    public configuration?: Configuration

    /**
     * Get all ActivitySpecs registered.
     */
    public async all(): Promise<ActivitySpec[]> {
        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve(Demo.ActivitySpec.map(x => Object.assign(new ActivitySpec(), x)))
        }
        return (await Fetch.get<{data: any[]}>(`/activity_spec`, this.configuration)).data.map(x => Object.assign(new ActivitySpec(), x))
    }

    /**
     * Create a new ActivitySpec.
     * @param activitySpec 
     */
    public async create(activitySpec: ActivitySpec): Promise<Identifier> {
        if (activitySpec === null || activitySpec === undefined)
            throw new Error('Required parameter activitySpec was null or undefined when calling activitySpecCreate.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.post(`/activity_spec`, activitySpec, this.configuration))
    }

    /**
     * Delete an ActivitySpec.
     * @param activitySpecName 
     */
    public async delete(activitySpecName: Identifier): Promise<Identifier> {
        if (activitySpecName === null || activitySpecName === undefined)
            throw new Error('Required parameter activitySpecName was null or undefined when calling activitySpecDelete.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.delete(`/activity_spec/${activitySpecName}`, this.configuration))
    }

    /**
     * Update an ActivitySpec.
     * @param activitySpecName 
     * @param activitySpec 
     */
    public async update(activitySpecName: Identifier, activitySpec: ActivitySpec): Promise<Identifier> {
        if (activitySpecName === null || activitySpecName === undefined)
            throw new Error('Required parameter activitySpecName was null or undefined when calling activitySpecUpdate.')
        if (activitySpec === null || activitySpec === undefined)
            throw new Error('Required parameter activitySpec was null or undefined when calling activitySpecUpdate.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.put(`/activity_spec/${activitySpecName}`, activitySpec, this.configuration))
    }

    /**
     * View an ActivitySpec.
     * @param activitySpecName 
     */
    public async view(activitySpecName: string): Promise<ActivitySpec> {
        if (activitySpecName === null || activitySpecName === undefined)
            throw new Error('Required parameter activitySpecName was null or undefined when calling activitySpecView.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let data = Demo.ActivitySpec.filter(x => x['name'] === activitySpecName).map(x => Object.assign(new ActivitySpec(), x))
            return Promise.resolve(data.length > 0 ? data[0] : { 'error': '404.not-found' } as any)
        }
        return (await Fetch.get<{data: any[]}>(`/activity_spec/${activitySpecName}`, this.configuration)).data.map(x => Object.assign(new ActivitySpec(), x))[0]
    }
}
