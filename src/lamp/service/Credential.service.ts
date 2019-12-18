import { Fetch, Configuration } from './Fetch'
import { Identifier } from '../model/Type'
import { Credential } from '../model/Credential'

export class CredentialService {
    public configuration?: Configuration

    /**
     * 
     * @param typeId 
     * @param secretKey 
     */
    public async create(typeId: Identifier, accessKey: string, secretKey: string, description?: string): Promise<Credential> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling credentialCreate.')
        if (accessKey === null || accessKey === undefined)
            throw new Error('Required parameter accessKey was null or undefined when calling credentialCreate.')
        if (secretKey === null || secretKey === undefined)
            throw new Error('Required parameter secretKey was null or undefined when calling credentialCreate.')

        return (await Fetch.post(`/type/${typeId}/credential`, { origin: typeId, access_key: accessKey, secret_key: secretKey, description: description }, this.configuration))
    }

    /**
     * 
     * @param typeId 
     * @param accessKey 
     */
    public async delete(typeId: Identifier, accessKey: string): Promise<Identifier> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling credentialDelete.')
        if (accessKey === null || accessKey === undefined)
            throw new Error('Required parameter accessKey was null or undefined when calling credentialDelete.')

        return (await Fetch.delete(`/type/${typeId}/credential/${accessKey}`, this.configuration))
    }

    /**
     * 
     * @param typeId 
     */
    public async list(typeId: Identifier): Promise<Credential[]> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling credentialList.')

        return (await Fetch.get<{data: any[]}>(`/type/${typeId}/credential`, this.configuration)).data.map(x => Object.assign(new Credential(), x))
    }

    /**
     * 
     * @param typeId 
     * @param accessKey 
     * @param secretKey 
     */
    public async update(typeId: Identifier, accessKey: string, secretKey: string): Promise<Identifier> {
        if (typeId === null || typeId === undefined)
            throw new Error('Required parameter typeId was null or undefined when calling credentialUpdate.')
        if (accessKey === null || accessKey === undefined)
            throw new Error('Required parameter accessKey was null or undefined when calling credentialUpdate.')
        if (secretKey === null || secretKey === undefined)
            throw new Error('Required parameter secretKey was null or undefined when calling credentialUpdate.')

        return (await Fetch.put(`/type/${typeId}/credential/${accessKey}`, secretKey, this.configuration))
    }
}
