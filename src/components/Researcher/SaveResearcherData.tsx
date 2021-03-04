import { Service } from "../DBService/DBService"

async function fetchResult(authString, id, type, modal) {
  const baseUrl = "https://lampv2.zcodemo.com:9093"
  console.log(`${baseUrl}/${modal}/${id}/_lookup/${type}`, authString, id)
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

const saveStudiesAndParticipants = (result) => {
  const studies = result.studies.map(({ id, name, participants_count }) => ({ id, name, participants_count }))
  let participants = []
  result.studies.map((study) => {
    let each = study.participants
    if (each.length > 0) {
      participants = participants.concat([
        Object.assign(
          {},
          ...each.map((item) => ({
            parent: study.name,
            parentID: study.id,
            id: item.id,
          }))
        ),
      ])
    }
  })
  Service.addData("studies", studies)
  Service.addData("participants", participants)
}

const saveStudyData = (result, type) => {
  Service.update("studies", result, type === "activities" ? "activity_count" : "sensor_count", "study_id")
  Service.addData(type, result[type])
}

const saveSettings = (newVal, key) => {
  Service.update("participants", newVal, key, "id")
}

export const saveDataToCache = (authString, id) => {
  fetchResult(authString, id, "participant", "researcher").then((result) => {
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
  })

  fetchResult(authString, id, "activity", "researcher").then((result) => {
    saveStudyData(result, "activities")
    fetchResult(authString, id, "sensor", "researcher").then((result) => {
      saveStudyData(result, "sensors")
    })
  })
}
