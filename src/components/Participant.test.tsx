// The app module graph pulls in ESM-only packages (react-markdown, jose) that
// jest cannot transform, so component imports are stubbed; the helpers under
// test are the real exports from Participant.tsx.
import { beforeEach, describe, expect, it, jest } from "@jest/globals"

jest.mock("lamp-core", () => {
  const { jest: j } = require("@jest/globals")
  return {
    __esModule: true,
    default: {
      Auth: { _auth: {}, _type: "participant" },
      Type: { getAttachment: j.fn(), setAttachment: j.fn() },
      Activity: { view: j.fn(), allByParticipant: j.fn() },
      ActivityEvent: { allByParticipant: j.fn() },
    },
  }
})
jest.mock("./DBService/DBService", () => {
  const { jest: j } = require("@jest/globals")
  return {
    Service: {
      getUserDataByKey: j.fn(),
      getAllTags: j.fn(),
      addUserData: j.fn(),
      getActivityEventData: j.fn(),
    },
  }
})
jest.mock("./AuthProvider", () => ({ useAuthContext: () => ({ isLoggedIn: true }) }))
jest.mock("./BottomMenu", () => ({ __esModule: true, default: () => null, sensorEventUpdate: () => {} }))
jest.mock("./Survey", () => ({ __esModule: true, default: () => null }))
jest.mock("./Feed", () => ({ __esModule: true, default: () => null }))
jest.mock("./Prevent", () => ({ __esModule: true, default: () => null }))
jest.mock("./Manage", () => ({ __esModule: true, default: () => null }))
jest.mock("./Learn", () => ({ __esModule: true, default: () => null }))
jest.mock("./Welcome", () => ({ __esModule: true, default: () => null }))
jest.mock("./ResponsiveDialog", () => ({ __esModule: true, default: () => null }))
jest.mock("./VisualPopup", () => ({ __esModule: true, default: () => null }))
jest.mock("./NoActivityPopup", () => ({ __esModule: true, default: () => null }))
jest.mock("./Streak", () => ({ __esModule: true, default: () => null }))

import LAMP from "lamp-core"
import { Service } from "./DBService/DBService"
import { activityTagFromImage, activityTagStale, getActivityTag, getImage } from "./Participant"

const mockedAttachment = LAMP.Type.getAttachment as any
const mockedGetByKey = Service.getUserDataByKey as any
const mockedAddUserData = Service.addUserData as any

const survey = {
  id: "s1",
  spec: "lamp.survey",
  settings: [
    { text: "q1", type: "list", options: ["0", "1"] },
    { text: "q2", type: "text", options: null },
  ],
}
const surveyTag = {
  id: "s1",
  spec: "lamp.survey",
  questions: [{ options: [{ description: "a" }, { description: "b" }] }, { options: [] }],
}
const img = {
  showFeed: false,
  description: "desc",
  photo: "p.png",
  streak: { streak: 2 },
  questions: surveyTag.questions,
  visualSettings: null,
  branchingSettings: null,
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("getImage", () => {
  it("returns attachment data on success", async () => {
    mockedAttachment.mockResolvedValue({ data: img })
    await expect(getImage("s1", "lamp.survey")).resolves.toEqual(img)
  })
  it("returns undefined on a genuine 404", async () => {
    mockedAttachment.mockResolvedValue({ error: "404.object-not-found" })
    await expect(getImage("s1", "lamp.survey")).resolves.toBeUndefined()
    mockedAttachment.mockResolvedValue({ message: "404.object-not-found" })
    await expect(getImage("s1", "lamp.survey")).resolves.toBeUndefined()
  })
  it("rejects on any other error so callers do not persist it", async () => {
    mockedAttachment.mockResolvedValue({ error: "500.internal-server-error" })
    await expect(getImage("s1", "lamp.survey")).rejects.toThrow("500")
    mockedAttachment.mockRejectedValue(new Error("network down"))
    await expect(getImage("s1", "lamp.survey")).rejects.toThrow("network down")
  })
})

describe("activityTagStale", () => {
  it("treats a missing record as stale for any spec", () => {
    expect(activityTagStale({ id: "x", spec: "lamp.breathe" }, undefined)).toBe(true)
  })
  it("treats a survey record without wording as stale", () => {
    expect(activityTagStale(survey, { id: "s1", questions: null })).toBe(true)
  })
  it("treats a question-count mismatch as stale (edited survey)", () => {
    expect(activityTagStale(survey, { id: "s1", questions: [{ options: [] }] })).toBe(true)
  })
  it("treats an option-count mismatch as stale (edited survey)", () => {
    const tag = { id: "s1", questions: [{ options: [{ description: "a" }] }, { options: [] }] }
    expect(activityTagStale(survey, tag)).toBe(true)
  })
  it("accepts a matching survey record", () => {
    expect(activityTagStale(survey, surveyTag)).toBe(false)
  })
  it("accepts a healthy non-survey record", () => {
    expect(activityTagStale({ id: "b1", spec: "lamp.breathe" }, { id: "b1", questions: null })).toBe(false)
  })
})

describe("getActivityTag", () => {
  it("returns the cached record without hitting the server when fresh", async () => {
    mockedGetByKey.mockResolvedValue([surveyTag])
    await expect(getActivityTag(survey)).resolves.toEqual(surveyTag)
    expect(mockedAttachment).not.toHaveBeenCalled()
    expect(mockedAddUserData).not.toHaveBeenCalled()
  })
  it("fetches, upserts, and returns a fresh record on a cache miss", async () => {
    mockedGetByKey.mockResolvedValue([])
    mockedAttachment.mockResolvedValue({ data: img })
    await expect(getActivityTag(survey)).resolves.toMatchObject({ id: "s1", questions: img.questions })
    expect(mockedAddUserData).toHaveBeenCalledWith(
      "activitytags",
      [expect.objectContaining({ id: "s1", questions: img.questions })],
      true
    )
  })
  it("re-fetches a record whose wording was never stored", async () => {
    mockedGetByKey.mockResolvedValue([{ id: "s1", questions: null }])
    mockedAttachment.mockResolvedValue({ data: img })
    await expect(getActivityTag(survey)).resolves.toMatchObject({ id: "s1", questions: img.questions })
  })
  it("re-fetches when the survey structure changed since the record was cached", async () => {
    mockedGetByKey.mockResolvedValue([{ id: "s1", questions: [{ options: [{ description: "a" }] }] }])
    mockedAttachment.mockResolvedValue({ data: img })
    await expect(getActivityTag(survey)).resolves.toMatchObject({ id: "s1" })
    expect(mockedAttachment).toHaveBeenCalled()
  })
  it("keeps the stale record without writing on a transient failure", async () => {
    const stale = { id: "s1", questions: null }
    mockedGetByKey.mockResolvedValue([stale])
    mockedAttachment.mockResolvedValue({ error: "503.unavailable" })
    await expect(getActivityTag(survey)).resolves.toEqual(stale)
    expect(mockedAddUserData).not.toHaveBeenCalled()
  })
})

describe("activityTagFromImage", () => {
  it("builds a record with defaults for a missing attachment", () => {
    expect(activityTagFromImage({ id: "a1", spec: "lamp.survey" }, undefined)).toEqual({
      id: "a1",
      category: undefined,
      showFeed: true,
      spec: "lamp.survey",
      description: "",
      photo: null,
      streak: null,
      questions: null,
      visualSettings: null,
      branchingSettings: null,
    })
  })
})
