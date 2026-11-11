import LAMP from "lamp-core"
import { Service } from "./DBService/DBService"

export async function getActivityTag(activityId: string, spec: string) {
  const res: any = await LAMP.Type.getAttachment(
    activityId,
    spec === "lamp.survey" ? "lamp.dashboard.survey_description" : "lamp.dashboard.activity_details"
  )
  return res?.error ? undefined : res?.data
}

export const buildActivityRow = (activity, img) => ({
  id: activity.id,
  category: activity.category,
  spec: activity.spec,
  showFeed: img?.showFeed ?? true,
  description: img?.description ?? "",
  photo: img?.photo ?? null,
  streak: img?.streak ?? null,
  questions: img?.questions ?? null,
  visualSettings: img?.visualSettings ?? null,
  branchingSettings: img?.branchingSettings ?? null,
})

// Fetch the activity's dashboard attachment then cache it. If not found, falls back
// to cached row, else write default values
export async function loadActivityTag(activity) {
  const details = await getActivityTag(activity.id, activity.spec).catch(() => undefined)
  if (details === undefined) {
    const cached = (await Service.getUserDataByKey("activitytags", [activity.id], "id"))[0]
    if (cached) return cached
  }
  const row = buildActivityRow(activity, details)
  await Service.addUserDBRow("activitytags", row)
  return row
}
