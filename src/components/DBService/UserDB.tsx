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
}

export const userDbPromise = idb.openDB<LampUSERDB>(DATABASE_NAME, 1, {
  upgrade(lampUserDb) {
    if (!lampUserDb.objectStoreNames.contains("activitytags")) {
      const user = lampUserDb.createObjectStore("activitytags", { keyPath: "id" })
      user.createIndex("id", "id", { unique: true })
    }
  },
})
