import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { DynamicAttachment } from '../model/DynamicAttachment'

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

        return (await Fetch.get(`/type/${typeId}/attachment/dynamic/${attachmentKey}?${queryParameters.toString()}`, this.configuration))
    }

    /**
     * 
     * @param typeId 
     */
    public async listAttachments(typeId: Identifier): Promise<any[]> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeListAttachments.')

        return (await Fetch.get(`/type/${typeId}/attachment`, this.configuration))
    }

    /**
     * Get the parent type identifier of the data structure referenced by the identifier.
     * @param typeId 
     */
    public async parent(typeId: Identifier): Promise<any> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling typeParent.')

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

        return (await Fetch.put(`/type/${typeId}/attachment/dynamic/${attachmentKey}/${target}?${queryParameters.toString()}`, attachmentValue, this.configuration))
    }
}
