import { Service } from "../DBService/DBService"
import demo_db from "../../demo_db.json"
import LAMP from "lamp-core"

export const fetchResult = async (authString, id, type, modal) => {
  const baseUrl = "https://" + (!!LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital")
  let result = await (
    await fetch(`${baseUrl}/${modal}/${id}/_lookup/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authString,
      },
    })
  ).json()
  return result
}

export const fetchPostData = async (authString, id, type, modal, methodType, bodyData) => {
  const baseUrl = "https://" + (!!LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital")
  let result = await (
    await fetch(`${baseUrl}/${modal}/${id}/${type}`, {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authString,
      },
      body: JSON.stringify(bodyData),
    })
  ).json()
  return result
}

const saveStudiesAndParticipants = (result) => {
  const studies = result.studies.map(({ id, name, participant_count }) => ({ id, name, participant_count }))
  let participants = []
  result.studies.map((study) => {
    participants = participants.concat(study.participants)
  })
  Service.addData("studies", studies)
  Service.addData("participants", participants)
}

export const saveStudyData = (result, type) => {
  Service.update("studies", result, type === "activities" ? "activity_count" : "sensor_count", "study_id")
  Service.addData(type, result[type])
}
const saveSettings = (newVal, key) => {
  Service.update("participants", newVal, key, "id")
}

export const saveDemoData = () => {
  Service.deleteDB()
  Service.addData("participants", demo_db.Participant)
  Service.addData("studies", demo_db.Study)
  Service.addData("activities", demo_db.Activity)
  Service.addData("sensors", demo_db.Sensor)
  Service.updateValues("activities", { activities: [{ study_id: "study1", study_name: "Demo" }] }, [
    "study_id",
    "study_name",
  ])
  Service.updateValues("sensors", { sensors: [{ study_id: "study1", study_name: "Demo" }] }, ["study_id", "study_name"])
  Service.updateValues(
    "studies",
    {
      studies: [{ participant_count: 1, sensor_count: demo_db.Sensor.length, activity_count: demo_db.Activity.length }],
    },
    ["sensor_count", "activity_count", "participant_count"]
  )
}

export const saveDataToCache = (authString, id) => {
  Service.getAll("researcher").then((data) => {
    if ((data || []).length == 0 || ((data || []).length > 0 && (data || [])[0]?.id !== id)) {
      fetchResult(authString, id, "participant", "researcher").then((result) => {
        if (!!result.studies) {
          saveStudiesAndParticipants(result)
          Service.addData("researcher", [{ id: id, notification: result.unityhealth_settings }])
          result.studies.map((study) => {
            if (result.unityhealth_settings) {
              fetchResult(authString, study.id, "participant/mode/3", "study").then((settings) => {
                saveSettings(settings, "name")
                saveSettings(settings, "unity_settings")
              })
            } else {
              fetchResult(authString, study.id, "participant/mode/4", "study").then((settings) => {
                saveSettings(settings, "name")
              })
            }
            fetchResult(authString, study.id, "participant/mode/1", "study").then((sensors) => {
              saveSettings(sensors, "accelerometer")
              saveSettings(sensors, "analytics")
              saveSettings(sensors, "gps")
              fetchResult(authString, study.id, "participant/mode/2", "study").then((events) => {
                saveSettings(events, "active")
              })
            })
          })
          fetchResult(authString, id, "activity", "researcher").then((result) => {
            saveStudyData(result, "activities")
            fetchResult(authString, id, "sensor", "researcher").then((result) => {
              saveStudyData(result, "sensors")
            })
          })
        }
      })
    }
  })
}
