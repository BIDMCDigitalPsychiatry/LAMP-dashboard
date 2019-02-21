/* eslint-disable */

// The root type in LAMP. You must use `LAMP.connect(...)` to begin using any LAMP classes.
export default class LAMP {

    // ActivitySpecID for anything that is a survey
    static get SURVEY_SPEC() {
        return 'QWN0aXZpdHlTcGVjOjEK';
    }

    // ActivitySpecID for anything that is a batch
    static get BATCH_SPEC() {
        return 'QWN0aXZpdHlTcGVjOjAK';
    }

    // Connect to an instance of a server hosting the LAMP API and mirror it locally.
    static async connect(root_url) {

        // Convenience method to wrap most of the Fetch API's nuances away.
        async function _fetch(method, base, route, data) {
            const options = {
                method: method,
                headers: new Headers({
                    'Authorization': `Basic ${LAMP.auth.id}:${LAMP.auth.password}`,
                })
            }
            if (data !== undefined)
                options.body = JSON.stringify(data)

            var res = await (await fetch(`${base}${route}`, options)).json()

            if (res['fatal'] !== undefined)
                throw new Error('SERVER: ' + res['fatal']['message'] + '\n' + res['fatal']['trace'])
            else if (res['error'] !== undefined)
                throw new Error(res['error'])
            return res
        }

        // Invoke the REST endpoint call and produce local LAMP objects. [Runtime]
        // Get the JSON from the remote server and convert it into LAMP objects. [Runtime]
        // This is invoked at runtime via `LAMP.Study.view('...')`, etc.
        async function _get_rest(sys, http_method, base, args) {
            // Parse the base url and replace URL components. [Runtime]
            let frags = base.replace(/({[a-zA-Z0-9_]+})/g, (x) => {
                let y = args.shift()
                if (y === undefined)
                    throw new Error('expected more arguments than provided')
                return y
            })

            // Get request body and handling hints if provided.
            let body = args.shift()
            let hints = args.shift()
            if (args.length > 0)
                throw new Error('expected fewer arguments than provided')

            // Obtain JSON and throw an error if that was the case. [Runtime]
            let data = await _fetch(http_method, root_url, frags, body)
            if (data.data === undefined)
                throw new Error('no data returned')

            // If the API hints includes `untyped`, don't typecast it!
            if (hints !== undefined && hints.untyped === true)
                return data.data

            // If not error, map each result to an object. [Runtime]
            return data.data.map(x => Object.assign(new LAMP.types[sys](), x))
        }

        // Download the API definition from the server at root_url.
        LAMP.auth = {type: null, id: null, password: null}
        let api = await (await fetch(`${root_url}`, {method: 'GET'})).json()
        LAMP.typedef = api

        // Registry of all generated remote types available on the LAMP API server.
        // The base type for all of these generated types, LAMP, is also present.
        LAMP.types = { "LAMP": LAMP }

        // Parse all remote declared types and transform them into local classes.
        for (let sys in api.components.schemas) {
            let obj = api.components.schemas[sys]
            let t = eval(`(function() { function ${sys} () {}; ${sys}.prototype = Object.create(LAMP.prototype); return ${sys}; })()`)

            // Convert properties to null keys and endpoints to static methods. 
            Object.entries(obj.properties || {}).forEach(prop => {
                t.prototype[prop] = null
            })
            Object.entries(api.paths)
                .filter(x => Object.values(x[1])[0].operationId.startsWith(sys + '::'))
                .forEach(endpoint => {                    
                    Object.entries(endpoint[1]).forEach(x => {
                        var method = x[0].toUpperCase()
                        t[x[1].operationId.split('::')[1]] = async function() {
                            return await _get_rest(sys, method, endpoint[0], Array.from(arguments))
                        }
                    })
                })

            // Make the new class accessible under LAMP as static properties.
            LAMP[sys] = t
            LAMP.types[sys] = t
        }

        // Load a session-stored authorization token if available.
        let _saved = JSON.parse(sessionStorage.getItem('LAMP.auth')) || LAMP.auth
        await LAMP.set_identity(_saved.type, _saved.id, _saved.password)
    }

    // Authenticate/authorize as a user of a given `type`.
    // If all values are null (especially `type`), the authorization is cleared.
    static async set_identity(type = null, id = null, password = null) {
        let l = LAMP.auth || {type: null, id: null, password: null}
        if (l.type === type && l.id === id && l.password === password)
            return

        try {
            LAMP.auth = {type: type, id: id, password: password}
            if (type === 'root') {
                LAMP.me = await LAMP.Researcher.all()
            } else if (type === 'researcher') {
                LAMP.me = (await LAMP.Researcher.view('me'))[0]
            } else if (type === 'participant') {
                LAMP.me = (await LAMP.Participant.view('me'))[0]
            } else {
                LAMP.me = null
            }
        } catch(err) {
            LAMP.auth = {type: null, id: null, password: null}
            LAMP.me = null
            throw err
        } finally {
            if (LAMP.auth.type === null && LAMP.auth.id === null && LAMP.auth.password === null)
                LAMP.auth = null
            sessionStorage.setItem('LAMP.auth', JSON.stringify(LAMP.auth))
        }
    }

    // Get the current authenticated/authorized identity.
    static get_identity() {
        return LAMP.me
    }
}
