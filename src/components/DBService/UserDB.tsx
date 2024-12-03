import { DBSchema } from "idb"
import * as idb from "idb"
const DATABASE_NAME = "LAMP-USER-DB"

interface LampUSERDB extends DBSchema {
  activitytags: {
    key: string
    value: {
      description: string
      photo: string
      streak: any
      spec: string
    }
    indexes: { id: string }
  }
  activityEvents: {
    key: string
    value: {
      activity: string
      timestamp: string
      duration: any
      static_data: object
      temporal_slices: []
    }
    indexes: { id: number }
  }
}

export const userDbPromise = idb.openDB<LampUSERDB>(DATABASE_NAME, 1, {
  upgrade(lampUserDb) {
    if (!lampUserDb.objectStoreNames.contains("activitytags")) {
      const user = lampUserDb.createObjectStore("activitytags", { keyPath: "id" })
      user.createIndex("id", "id", { unique: true })
    }
    if (!lampUserDb.objectStoreNames.contains("activityEvents")) {
      const activityEvents = lampUserDb.createObjectStore("activityEvents", { autoIncrement: true })
      activityEvents.createIndex("id", "id", { unique: true })
    }
  },
})
