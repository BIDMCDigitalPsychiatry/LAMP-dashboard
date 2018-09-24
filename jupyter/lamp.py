import os
import re
import csv
import json
import itertools
import urllib.request as request

# The root type in LAMP. You must use LAMP.connect(...) to begin using any LAMP classes.
class LAMP(object):
    
    # Basic data model methods that all derived types inherit.
    def __init__(self):
        pass
    def __init__(self, json_dict):
        for k, v in json_dict.items():
            self.__dict__[k] = v
    def __str__(self):
        return {**{ '_type': type(self) }, **self.__dict__}.__str__()
    def __repr__(self):
        return {**{ '_type': type(self) }, **self.__dict__}.__repr__()
    def __hash__(self):
        return hash(self.__dict__['id']) if 'id' in self.__dict__ else 0
    def __eq__(self, other):
        if isinstance(other, self.__class__) and ('id' in self.__dict__ and 'id' in other.__dict__):
            return self.__dict__['id'] == other.__dict__['id']
        else:
            return False
    def __ne__(self, other):
        return not self.__eq__(other)
    
    # The headers for the client, as sent by the LAMP API server.
    header = { }
    
    # Registry of all generated remote types available on the LAMP API server.
    # The base type for all of these generated types, LAMP, is also present.
    types = { }
    
    # Connect to an instance of a server hosting the LAMP API and mirror it locally.
    @staticmethod
    def connect(root_url, auth_type, username, password):
        
        # Download the API definition from the server at root_url.
        api = json.loads(request.urlopen(root_url).read())
        LAMP.header = api.pop('LAMP', None)
        LAMP.types['LAMP'] = LAMP
        
        # Invoke the REST endpoint call and produce local LAMP objects. [Runtime]
        def get_rest(sys, url):
            
            # Get the JSON from the remote server and convert it into LAMP objects. [Runtime]
            # This is invoked at runtime via `LAMP.Study.view('...')`, etc.
            def runtime_json(*x):
                x = list(x)
                if x[0] is ():
                    x.pop(0)
                
                # Parse the base url and replace URL components. [Runtime]
                base = url.replace('GET ', '')
                if base.count('@') is not len(x):
                    raise ValueError('incorrect number of arguments for this endpoint (expected {0}, received {1})'.format(base.count("@"), len(x)))
                base = re.sub("(@[a-zA-Z0-9_]+)", lambda m: x.pop(0)[0], base)
                
                # Obtain JSON and throw an error if that was the case. [Runtime]
                data = {}
                try:
                    auth = '?auth=' + ':'.join([auth_type, username, password])
                    data = request.urlopen(root_url + base + auth).read()
                except urllib.error.HTTPError as error:
                    data = error.read()
                data = json.loads(data)
                if ('error' in data) or ('result' not in data):
                    raise ValueError(data['error']) if 'error' in data else ValueError('no data returned')
                
                # If not error, map each result to an object. [Runtime]
                out = list(map(lambda r: LAMP.types[sys](r), data['result']))
                return out[0] if len(out) == 1 else out
            
            # The attachment to a LAMP derived class is a static lambda calling the above^.
            return staticmethod(lambda *x: runtime_json(x))
        
        # Parse all remote declared types and transform them into local classes.
        for sys, obj in api.items():
            
            # Convert properties to None for now, and endpoints to static methods.
            props = {x: None for x in obj.get('properties', {}).keys()}
            ends = {name: get_rest(sys, url) for name, url in obj.get('endpoints', {}).items()}
            t = type(sys, (LAMP,), {**props, **ends})
            
            # Make the new class accessible (and indexed) under LAMP as static properties.
            setattr(LAMP, sys, t)
            LAMP.types[sys] = t
