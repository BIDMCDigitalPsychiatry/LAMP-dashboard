import LAMP from "lamp-core"
import { Service } from "../../DBService/DBService"

// Splice a raw Activity object with its ActivityDescription object.
export function spliceActivity({ raw, tag }) {
  return {
    id: raw.id,
    study_id: raw.study_id,
    spec: "lamp.survey",
    name: raw.name,
    description: tag?.description,
    photo: tag?.photo,
    schedule: raw.schedule,
    settings: !Array.isArray(raw.settings)
      ? raw.settings
      : raw.settings.map((question, idx) => ({
          text: question.text,
          type: question.type,
          description: tag?.questions?.[idx]?.description,
          options:
            question.options === null
              ? null
              : question.options?.map((z, idx2) => ({
                  value: z,
                  description: tag?.questions?.[idx]?.options?.[idx2],
                })),
        })),
  }
}

// Un-splice an object into its raw Tips Activity object
export function unspliceTipsActivity(x) {
  return {
    raw: {
      id: x.id,
      name: x.name,
      spec: "lamp.tips",
      icon: x.icon,
      schedule: x.schedule,
      settings: x.settings,
      studyID: x.studyID,
    },
  }
}

// Un-splice an object into its raw Activity object and ActivityDescription object.
export function unspliceActivity(x) {
  return {
    raw: {
      id: x.id,
      study_id: x.study_id,
      spec: "lamp.survey",
      name: x.name,
      schedule: x.schedule,
      settings: (x.settings && Array.isArray(x.settings) ? x.settings : [])?.map((y) => ({
        text: y?.text,
        type: y?.type,
        options: y?.options === null ? null : y?.options?.map((z) => z?.value),
      })),
    },
    tag: {
      description: x.description,
      photo: x.photo,
      questions: (x.settings && Array.isArray(x.settings) ? x.settings : [])?.map((y) => ({
        multiselect: y?.type,
        description: y?.description,
        options: y?.options === null ? null : y?.options?.map((z) => z?.description),
      })),
    },
  }
}

export function unspliceCTActivity(x) {
  return {
    raw: {
      id: x.id,
      spec: x.spec,
      name: x.name,
      schedule: x.schedule,
      settings: x.settings,
    },
    tag: {
      description: x.description,
      photo: x.photo,
    },
  }
}

export function spliceCTActivity({ raw, tag }) {
  return {
    id: raw.id,
    study_id: raw.study_id,
    spec: raw.spec,
    name: raw.name,
    description: tag?.description,
    photo: tag?.photo,
    schedule: raw.schedule,
    settings: raw.settings,
  }
}

// Create a new Activity object & survey descriptions if set.
export async function saveTipActivity(x) {
  const { raw } = unspliceTipsActivity(x)
  let result
  if (!x.id && x.name) {
    result = (await LAMP.Activity.create(x.studyID, raw)) as any
    await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
      photo: x.icon,
    })
  } else {
    result = (await LAMP.Activity.update(x.id, {
      settings: x.settings,
    })) as any
    await LAMP.Type.setAttachment(x.id, "me", "lamp.dashboard.activity_details", {
      photo: x.icon,
    })
  }
  return result
}

export async function saveCTestActivity(x) {
  let newItem = (await LAMP.Activity.create(x.studyID, x)) as any
  if (x.spec !== "lamp.dbt_diary_card") {
    await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.activity_details", {
      description: x.description,
      photo: x.photo,
    })
  }
  return newItem
}

export async function saveSurveyActivity(x) {
  // FIXME: ensure this is a lamp.survey only!
  const { raw, tag } = unspliceActivity(x)
  let newItem = (await LAMP.Activity.create(x.studyID, raw)) as any
  await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.survey_description", tag)
  return newItem
}

export async function saveGroupActivity(x) {
  let newItem = (await LAMP.Activity.create(x.studyID, {
    ...x,
    id: undefined,
    schedule: [
      {
        start_date: "1970-01-01T00:00:00.000Z", // FIXME should not need this!
        time: "1970-01-01T00:00:00.000Z", // FIXME should not need this!
        repeat_interval: "none", // FIXME should not need this!
        custom_time: null, // FIXME should not need this!
      },
    ],
  })) as any
  await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.activity_details", {
    description: x.description,
    photo: x.photo,
  })
  return newItem
}

export const updateSchedule = async (activity) => {
  let result = await LAMP.Activity.update(activity.id, { schedule: activity.schedule })
  Service.update("activities", { activities: [{ schedule: activity.schedule, id: activity.id }] }, "schedule", "id")
}
// Commit an update to an Activity object (ONLY DESCRIPTIONS).
export async function updateActivityData(x, isDuplicated, selectedActivity) {
  let result
  if (!["lamp.group", "lamp.survey", "lamp.tips"].includes(x.spec)) {
    // Short-circuit for groups and CTests
    if (isDuplicated) {
      result = (await LAMP.Activity.create(x.studyID, x)) as any
      await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
        description: x?.description ?? "",
        photo: x?.photo ?? "",
      })
      return result
    } else {
      if (selectedActivity.study_id !== x.studyID) {
        // let tag = await LAMP.Type.setAttachment(x.id, "me", "lamp.dashboard.activity_details", null)
        // console.dir("deleted tag " + JSON.stringify(tag))
        // await LAMP.Activity.delete(x.id)
        // result = (await LAMP.Activity.create(x.studyID, x)) as any
        // await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
        //   description: x?.description ?? "",
        //   photo: x?.photo ?? "",
        // })
      } else {
        result = (await LAMP.Activity.update(x.id, { name: x.name, settings: x.settings ?? [] })) as any
        await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.activity_details", {
          description: x.description,
          photo: x.photo,
        })
        return result
      }
    }
  } else if (x.spec === "lamp.group" || x.spec === "lamp.dbt_diary_card") {
    result = (await LAMP.Activity.update(selectedActivity.id, {
      name: x.name,
      settings: x.settings,
    })) as any

    await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.activity_details", {
      description: x.description,
      photo: x.photo,
    })
    return result
  } else if (x.spec === "lamp.survey") {
    const { raw, tag } = unspliceActivity(x)
    if (isDuplicated) {
      result = (await LAMP.Activity.create(x.studyID, raw)) as any
      await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.survey_description", tag)
      return result
    } else {
      result = (await LAMP.Activity.update(selectedActivity.id, raw)) as any
      await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.survey_description", tag)
      return result
    }
  } else if (x.spec === "lamp.tips") {
    if (x.id === undefined) {
      let tipObj = {
        id: x.id,
        name: x.name,
        icon: x.icon,
        studyID: selectedActivity.study_id,
        spec: "lamp.tips",
        settings: selectedActivity.settings,
        schedule: selectedActivity.schedule,
      }
      result = await saveTipActivity(tipObj)
      return result
    } else {
      let obj = {
        settings: x.settings,
      }
      result = (await LAMP.Activity.update(selectedActivity.id, obj)) as any
      await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.activity_details", {
        photo: x.icon,
      })
      return result
    }
  }
}

export function addActivity(x, studies) {
  Service.updateCount("studies", x.studyID, "activity_count")
  x["study_id"] = x.studyID
  x["study_name"] = studies.filter((study) => study.id === x.studyID)[0]?.name
  delete x["studyID"]
  Service.addData("activities", [x])
}
