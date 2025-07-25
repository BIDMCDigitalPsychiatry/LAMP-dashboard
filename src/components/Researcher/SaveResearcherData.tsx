import { Service } from "../DBService/DBService"
import demo_db from "../../demo_db.json"
import LAMP from "lamp-core"

interface StudyObject {
  id: string
  name: string
  isMessagingEnabled: boolean
  participants: Array<any>
  activities: Array<any>
  sensors: Array<any>
}
export const fetchResult = async (id, type, modal) => {
  const baseUrl = "https://" + (!!LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital")
  const userToken: any = JSON.parse(sessionStorage.getItem("tokenInfo"))
  let result = await (
    await fetch(`${baseUrl}/${modal}/${id}/_lookup/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken.accessToken,
      },
      credentials: "include",
    })
  ).json()
  return result
}

export const fetchPostData = async (id, type, modal, methodType, bodyData) => {
  const baseUrl = "https://" + (!!LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital")
  const userToken: any = JSON.parse(sessionStorage.getItem("tokenInfo"))
  let result = await (
    await fetch(`${baseUrl}/${modal}/${id}/${type}`, {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken.accessToken,
      },
      credentials: "include",
      body: JSON.stringify(bodyData),
    })
  ).json()
  return result
}

const saveStudiesAndParticipants = (result, studies, researcherId) => {
  let participants = []
  let activities = []
  let sensors = []
  let studiesList = []
  if (Array.isArray(result.studies)) {
    result.studies.map((study) => {
      participants = participants.concat(study.participants)
      activities = activities.concat(study.activities)
      sensors = sensors.concat(study.sensors)
    })
    studies.map((study) => {
      studiesList = studiesList.concat(study.name)
    })
  }
  let studiesSelected =
    localStorage.getItem("studies_" + researcherId) !== null
      ? JSON.parse(localStorage.getItem("studies_" + researcherId))
      : []
  if (studiesSelected.length === 0) {
    localStorage.setItem("studies_" + researcherId, JSON.stringify(studiesList))
    localStorage.setItem("studyFilter_" + researcherId, JSON.stringify(1))
  }
  Service.addData("studies", studies)
  Service.addData("participants", participants)
  Service.addData("sensors", sensors)
  Service.addData("activities", activities)
}

export const saveStudyData = (result, type) => {
  Service.update("studies", result, type === "activities" ? "activity_count" : "sensor_count", "study_id")
  Service.addData(type, result[type])
}
const saveSettings = (newVal, key) => {
  Service.update("participants", newVal, key, "id")
}

export const saveDemoData = () => {
  Service.addData("researcher", [{ id: "researcher1" }])
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

export const saveDataToCache = (id) => {
  Service.addData("researcher", [{ id: id }])

  LAMP.API.query(
    "($studyList := $LAMP.Study.list('" +
    id +
    "');" +
    "$unitySettings := $LAMP.Tag.get('" +
    id +
    "','to.unityhealth.psychiatry.enabled');" +
    " $filterAudioOut := function() { $ ~> |$|{}, ['audio']| };" + // `settings` field has been masked out from activities in this query to avoid responses that are too heavy to handle by the server. This can happen when many of the activities that are being queried contain some kind of heavy content (such as audio files).
      " $list :={'unity_settings': $LAMP.Tag.get('" +
      id +
      "','to.unityhealth.psychiatry.enabled')," +
      "'studies':[$map($studyList,function($study){{'name': $study.name,'id':$study.id,'isMessagingEnabled':$study.isMessagingEnabled," +
      "'participants':[$map($LAMP.Participant.list($study.id).id,function($id){{'name': " +
      "$LAMP.Tag.get($id,'lamp.name'), 'is_deleted': $LAMP.Tag.get($id,'lamp.is_deleted'), 'unity_settings' : $unitySettings ? " +
      "$LAMP.Tag.get($id,'to.unityhealth.psychiatry.settings') : null,'id':$id, 'study_id' : $study.id, 'study_name': $study.name }})]," +
      "'activities':[$map($LAMP.Activity.list($study.id),function($activity){{'name': " +
      " $activity.name, 'spec': $activity.spec, 'category': $activity.category, 'schedule': $activity.schedule, 'settings': $filterAudioOut($activity.settings),  'id':$activity.id, 'study_id' " +
      ": $study.id, 'study_name': $study.name}})]," +
      "'sensors':[$map($LAMP.Sensor.list($study.id),function($sensor){{'name': " +
      " $sensor.name,'id':$sensor.id,'spec': $sensor.spec,'study_id': $study.id,'study_name': $study.name}})]}})]})"
  ).then((data: any) => {
    let studies = Object.values(data?.studies || []).map((study: StudyObject) => {
      return {
        id: study?.id || "",
        name: study?.name || "",
        isMessagingEnabled: study?.isMessagingEnabled,
        participant_count: (study?.participants || []).length,
        activity_count: (study?.activities || []).length,
        sensor_count: (study?.sensors || []).length,
      }
    })
    saveStudiesAndParticipants(data, studies, id)
    studies?.map((study) => {
      fetchResult(study.id, "participant/mode/1", "study").then((sensors) => {
        saveSettings(sensors, "accelerometer")
        saveSettings(sensors, "analytics")
        saveSettings(sensors, "gps")
        fetchResult(study.id, "participant/mode/2", "study").then((events) => {
          saveSettings(events, "active")
        })
      })
    })
  })
}
