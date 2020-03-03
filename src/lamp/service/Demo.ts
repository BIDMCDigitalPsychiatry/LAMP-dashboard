// 
// [NOTE]: Demo mode carries various restrictions and does not: 
//       (1) verify R/W permissions.
//       (2) carry an audit log.
//       (3) support root operations.
//       (4) encrypt any data.
// 

export let Demo = {
    "Researcher": [
        {
            "#type": "Researcher",
            "#parent": null,
            "id": "researcher1",
            "name": "Demo",
            "email": "demo@demo.lamp.digital"
        }
    ],
    "Study": [
        {
            "#type": "Study",
            "#parent": "researcher1",
            "id": "study1",
            "name": "Demo"
        }
    ],
    "Participant": [
        {
            "#type": "Participant",
            "#parent": "study1",
            "id": "U123456789",
            "language": "en",
            "theme": "#359FFE",
            "emergency_contact": null,
            "helpline": null
        }
    ],
    "Activity": [
        {
            "#type": "Activity",
            "#parent": "study1",
            "id": "activity1",
            "spec": "lamp.survey",
            "name": "Anxiety",
            "settings": [
              {
                "text": "Feeling nervous, anxious, or on edge",
                "type": "likert",
                "options": null
              },
              {
                "text": " Not being able to stop or control worrying ",
                "type": "likert",
                "options": null
              },
              {
                "text": "Worrying too much about different things ",
                "type": "likert",
                "options": null
              },
              {
                "text": " Trouble relaxing ",
                "type": "likert",
                "options": null
              },
              {
                "text": "Being so restless that it's hard to sit still ",
                "type": "likert",
                "options": null
              },
              {
                "text": " Becoming easily annoyed or irritable ",
                "type": "likert",
                "options": null
              },
              {
                "text": "Feeling afraid as if something awful might\\nhappen",
                "type": "likert",
                "options": null
              }
            ],
            "schedule": [
              {
                "start_date": "2018-07-11T00:00:00.000Z",
                "time": "2018-07-11T16:12:00.000Z",
                "repeat_interval": "daily",
                "custom_time": null
              }
            ]
        },
        {
            "#type": "Activity",
            "#parent": "study1",
            "id": "activity2",
            "spec": "lamp.spatial_span",
            "name": "Spatial Span",
            "settings": {},
            "schedule": [
              {
                "start_date": "2018-07-11T00:00:00.000Z",
                "time": "2018-07-11T16:12:00.000Z",
                "repeat_interval": "daily",
                "custom_time": null
              }
            ]
        }
    ],
    "Sensor": [
        {
            "#type": "Sensor",
            "#parent": "study1",
            "id": "sensor1",
            "spec": "lamp.gps.contextual",
            "name": "Environmental Context",
            "settings": {}
        },
        {
            "#type": "Sensor",
            "#parent": "study1",
            "id": "sensor2",
            "spec": "lamp.step_count",
            "name": "Step Count",
            "settings": {}
        }
    ],
    "ActivityEvent": [

    ],
    "SensorEvent": [

    ],
    "ActivitySpec": [
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.group",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.survey",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.nback",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.trails_b",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.spatial_span",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.simple_memory",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.serial7s",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.cats_and_dogs",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.3d_figure_copy",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.visual_association",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.digit_span",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.cats_and_dogs_new",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.temporal_order",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.nback_new",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.trails_b_new",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.trails_b_dot_touch",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.jewels_a",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.jewels_b",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.scratch_image",
            "settings_schema": {}
        },
        {
            "#type": "ActivitySpec",
            "#parent": null,
            "name": "lamp.spin_wheel",
            "settings_schema": {}
        }
    ],
    "SensorSpec": [
        {
            "#type": "SensorSpec",
            "#parent": null,
            "name": "lamp.gps.contextual",
            "settings_schema": {}
        },
        {
            "#type": "SensorSpec",
            "#parent": null,
            "name": "lamp.step_count",
            "settings_schema": {}
        }
    ],
    "Credential": [
        {
            "#type": "Credential",
            "#parent": "researcher1",
            "origin": "researcher1",
            "access_key": "researcher@demo.lamp.digital",
            "secret_key": "demo",
            "description": "Demo Account"
        },
        {
            "#type": "Credential",
            "#parent": "researcher1",
            "origin": "researcher1",
            "access_key": "clinician@demo.lamp.digital",
            "secret_key": "demo",
            "description": "Demo Account"
        },
        {
            "#type": "Credential",
            "#parent": "U123456789",
            "origin": "U123456789",
            "access_key": "participant@demo.lamp.digital",
            "secret_key": "demo",
            "description": "Demo Account"
        },
        {
            "#type": "Credential",
            "#parent": "U123456789",
            "origin": "U123456789",
            "access_key": "patient@demo.lamp.digital",
            "secret_key": "demo",
            "description": "Demo Account"
        }
    ],
    "Tags": [
        {
            "#type": "Tag",
            "#parent": "U123456789",
            "target": "me",
            "key": "lamp.name",
            "value": "Demo" as any
        }
    ]
}
