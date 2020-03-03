import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { DynamicAttachment } from '../model/DynamicAttachment'
import { Demo } from './Demo'

export class TypeService {
    public configuration?: Configuration

    /**
     * 
     * @param typeId 
     * @param attachmentKey 
     */
    public async getAttachment(typeId: Identifier, attachmentKey: string): Promise<any[]> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeGetAttachment.')
        if (attachmentKey === null || attachmentKey === undefined)
            throw new Error('Required parameter attachmentKey was null or undefined when calling typeGetAttachment.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (typeId === 'me')
                typeId = credential.length > 0 ? credential[0]['origin'] : typeId
            
            let exists = [].concat(
                Demo.Researcher.filter(x => x['id'] === typeId), 
                Demo.Study.filter(x => x['id'] === typeId),
                Demo.Participant.filter(x => x['id'] === typeId),
                Demo.Activity.filter(x => x['id'] === typeId), // ???
            )
            if (exists.length > 0) { // FIXME: Sibling Tags? (Participant, Activity, Sensor)
                const ancestors = (obj: any) => 
                    (obj['#type'] === 'Researcher' ? [] : 
                    (obj['#type'] === 'Study' ? [ obj['#parent'] ] : 
                    (obj['#type'] === 'Participant' ? [ obj['#parent'], Demo.Study.filter(x => x['id'] === obj['#parent']).map(x => x['#parent'])[0] ] : 
                    (obj['#type'] === 'Activity' ? [ obj['#parent'], Demo.Study.filter(x => x['id'] === obj['#parent']).map(x => x['#parent'])[0] ] : 
                []))))
                const tagSelf = (tag: any) => [typeId].includes(tag['#parent']) && [typeId, 'me'].includes(tag['target']) // implicit & explicit
                const tagParent = (tag: any) => ancestors(exists[0]).includes(tag['#parent']) && [typeId, exists[0]['#type']].includes(tag['target']) // implicit & explicit
                let data = Demo.Tags.filter(x => (tagSelf(x) || tagParent(x)) && x['key'] === attachmentKey)
                return Promise.resolve(data.length > 0 ? { data: data[0]['value'] } as any : { 'error': '404.not-found' } as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get(`/type/${typeId}/attachment/${attachmentKey}`, this.configuration))
    }

    /**
     * 
     * @param typeId 
     * @param attachmentKey 
     * @param invokeAlways 
     * @param includeLogs 
     * @param ignoreOutput 
     */
    public async getDynamicAttachment(typeId: Identifier, attachmentKey: string, invokeAlways: boolean, includeLogs: boolean, ignoreOutput: boolean): Promise<DynamicAttachment[]> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeGetDynamicAttachment.')
        if (attachmentKey === null || attachmentKey === undefined)
            throw new Error('Required parameter attachmentKey was null or undefined when calling typeGetDynamicAttachment.')
        if (invokeAlways === null || invokeAlways === undefined)
            throw new Error('Required parameter invokeAlways was null or undefined when calling typeGetDynamicAttachment.')
        if (includeLogs === null || includeLogs === undefined)
            throw new Error('Required parameter includeLogs was null or undefined when calling typeGetDynamicAttachment.')
        if (ignoreOutput === null || ignoreOutput === undefined)
            throw new Error('Required parameter ignoreOutput was null or undefined when calling typeGetDynamicAttachment.')

        let queryParameters = new URLSearchParams()
        if (invokeAlways !== undefined && invokeAlways !== null)
            queryParameters.set('invoke_always', <any>invokeAlways)
        if (includeLogs !== undefined && includeLogs !== null)
            queryParameters.set('include_logs', <any>includeLogs)
        if (ignoreOutput !== undefined && ignoreOutput !== null)
            queryParameters.set('ignore_output', <any>ignoreOutput)

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.get(`/type/${typeId}/attachment/dynamic/${attachmentKey}?${queryParameters.toString()}`, this.configuration))
    }

    /**
     * 
     * @param typeId 
     */
    public async listAttachments(typeId: Identifier): Promise<any[]> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeListAttachments.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (typeId === 'me')
                typeId = credential.length > 0 ? credential[0]['origin'] : typeId

            let exists = [].concat(
                Demo.Researcher.filter(x => x['id'] === typeId), 
                Demo.Study.filter(x => x['id'] === typeId),
                Demo.Participant.filter(x => x['id'] === typeId),
                Demo.Activity.filter(x => x['id'] === typeId), // ???
            )
            if (exists.length > 0) { // FIXME: Sibling Tags? (Participant, Activity, Sensor)
                const ancestors = (obj: any) => 
                    (obj['#type'] === 'Researcher' ? [] : 
                    (obj['#type'] === 'Study' ? [ obj['#parent'] ] : 
                    (obj['#type'] === 'Participant' ? [ obj['#parent'], Demo.Study.filter(x => x['id'] === obj['#parent']).map(x => x['#parent'])[0] ] : 
                    (obj['#type'] === 'Activity' ? [ obj['#parent'], Demo.Study.filter(x => x['id'] === obj['#parent']).map(x => x['#parent'])[0] ] : 
                []))))
                const tagSelf = (tag: any) => [typeId].includes(tag['#parent']) && [typeId, 'me'].includes(tag['target']) // implicit & explicit
                const tagParent = (tag: any) => ancestors(exists[0]).includes(tag['#parent']) && [typeId, exists[0]['#type']].includes(tag['target']) // implicit & explicit
                return Promise.resolve({ data: Demo.Tags.filter(x => (tagSelf(x) || tagParent(x))).map(x => x.key) } as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.get(`/type/${typeId}/attachment`, this.configuration))
    }

    /**
     * Get the parent type identifier of the data structure referenced by the identifier.
     * @param typeId 
     */
    public async parent(typeId: Identifier): Promise<any> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeParent.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (typeId === 'me')
                typeId = credential.length > 0 ? credential[0]['origin'] : typeId

            let possible = []
            possible = Demo.Researcher.filter(x => x['id'] === typeId)
            if (possible.length > 0) {
                return Promise.resolve({ data: {} } as any)
            }
            possible = Demo.Study.filter(x => x['id'] === typeId)
            if (possible.length > 0) {
                return Promise.resolve({ data: { 'Researcher': possible[0]['#parent'] } } as any)
            }
            possible = Demo.Participant.filter(x => x['id'] === typeId)
            if (possible.length > 0) {
                return Promise.resolve({ data: { 'Researcher': Demo.Study.filter(x => x['id'] === possible[0]['#parent'])[0], 'Study': possible[0]['#parent'] } } as any)
            }
            possible = Demo.Activity.filter(x => x['id'] === typeId)
            if (possible.length > 0) {
                return Promise.resolve({ data: { 'Researcher': Demo.Study.filter(x => x['id'] === possible[0]['#parent'])[0], 'Study': possible[0]['#parent'] } } as any)
            }
            return Promise.resolve({ 'error': '404.not-found' } as any)
        }
        return (await Fetch.get(`/type/${typeId}/parent`, this.configuration))
    }

    /**
     * 
     * @param typeId 
     * @param target 
     * @param attachmentKey 
     * @param attachmentValue 
     */
    public async setAttachment(typeId: Identifier, target: string, attachmentKey: string, attachmentValue: any): Promise<Identifier> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeSetAttachment.')
        if (target === null || target === undefined)
            throw new Error('Required parameter target was null or undefined when calling typeSetAttachment.')
        if (attachmentKey === null || attachmentKey === undefined)
            throw new Error('Required parameter attachmentKey was null or undefined when calling typeSetAttachment.')
        if (attachmentValue === undefined)
            throw new Error('Required parameter attachmentValue was null or undefined when calling typeSetAttachment.')

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            let auth = (this.configuration.authorization || ':').split(':')
            let credential = Demo.Credential.filter(x => x['access_key'] === auth[0] && x['secret_key'] === auth[1])
            if (credential.length === 0)
                return Promise.resolve({ 'error': '403.invalid-credentials' } as any)
            if (typeId === 'me')
                typeId = credential.length > 0 ? credential[0]['origin'] : typeId

            let exists = [].concat(
                Demo.Researcher.filter(x => x['id'] === typeId), 
                Demo.Study.filter(x => x['id'] === typeId),
                Demo.Participant.filter(x => x['id'] === typeId),
                Demo.Activity.filter(x => x['id'] === typeId), // ???
            )
            if (exists.length > 0) { // FIXME: Sibling Tags? (Participant, Activity, Sensor)
                if (attachmentValue === null) { // DELETE
                    Demo.Tags = Demo.Tags.filter(x => !(x['#parent'] === typeId && x['target'] === target && x['key'] === attachmentKey))
                } else {
                    let idx = Demo.Tags.findIndex(x => (x['#parent'] === typeId && x['target'] === target && x['key'] === attachmentKey))
                    if (idx >= 0) { // UPDATE
                        console.dir('update')
                        Demo.Tags[idx]['value'] = attachmentValue
                    } else { // INSERT
                        console.dir('insert')
                        Demo.Tags.push({
                            '#type': 'Tag',
                            '#parent': typeId,
                            'target': target,
                            'key': attachmentKey,
                            'value': attachmentValue
                        })
                    }
                }
                return Promise.resolve({} as any)
            } else {
                return Promise.resolve({ 'error': '404.not-found' } as any)
            }
        }
        return (await Fetch.put(`/type/${typeId}/attachment/${attachmentKey}/${target}`, attachmentValue, this.configuration))
    }

    /**
     * 
     * @param invokeOnce 
     * @param typeId 
     * @param target 
     * @param attachmentKey 
     * @param attachmentValue 
     */
    public async setDynamicAttachment(invokeOnce: boolean, typeId: Identifier, target: string, attachmentKey: string, attachmentValue: DynamicAttachment): Promise<Identifier> {
        if (invokeOnce === null || invokeOnce === undefined)
            throw new Error('Required parameter invokeOnce was null or undefined when calling typeSetDynamicAttachment.')
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeSetDynamicAttachment.')
        if (target === null || target === undefined)
            throw new Error('Required parameter target was null or undefined when calling typeSetDynamicAttachment.')
        if (attachmentKey === null || attachmentKey === undefined)
            throw new Error('Required parameter attachmentKey was null or undefined when calling typeSetDynamicAttachment.')
        if (attachmentValue === null || attachmentValue === undefined)
            throw new Error('Required parameter attachmentValue was null or undefined when calling typeSetDynamicAttachment.')

        let queryParameters = new URLSearchParams()
        if (invokeOnce !== undefined && invokeOnce !== null)
            queryParameters.set('invoke_once', <any>invokeOnce)

        if (this.configuration.base === 'https://demo.lamp.digital') { // DEMO
            return Promise.resolve({ 'error': '500.demo-restriction' } as any)
        }
        return (await Fetch.put(`/type/${typeId}/attachment/dynamic/${attachmentKey}/${target}?${queryParameters.toString()}`, attachmentValue, this.configuration))
    }
}
