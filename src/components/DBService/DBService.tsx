import { DBSchema } from "idb"
import * as idb from "idb"
const DATABASE_NAME = "LAMP-DB"

interface LampDB extends DBSchema {
  researcher: {
    key: string
    value: {
      name: string
      notification: boolean
    }
    indexes: { id: string }
  }
  studies: {
    key: string
    value: {
      id: string
      name: string
      participant_count: number
      activity_count: number
      sensor_count: number
    }
    indexes: { id: string }
  }
  participants: {
    key: string
    value: {
      id: string
      name: string
      gps: Array<JSON>
      accelerometer: Array<JSON>
      active: Array<JSON>
      analytics: Array<JSON>
      study_id: string
      study_name: string
    }
    indexes: { study_name: string; id: string }
  }
  activities: {
    key: string
    value: {
      id: string
      name: string
      spec: string
      study_id: string
      study_name: string
      schedule: Array<JSON>
      settings?: Array<JSON>
    }
    indexes: { study_name: string; id: string }
  }
  sensors: {
    key: string
    value: {
      id: string
      name: string
      study_id: string
      study_name: string
    }
    indexes: { study_name: string; id: string }
  }
}

const dbPromise = idb.openDB<LampDB>(DATABASE_NAME, 1, {
  upgrade(lampDb) {
    if (!lampDb.objectStoreNames.contains("researcher")) {
      const researcher = lampDb.createObjectStore("researcher", { keyPath: "id" })
      researcher.createIndex("id", "id", { unique: true })
    }
    if (!lampDb.objectStoreNames.contains("studies")) {
      const studies = lampDb.createObjectStore("studies", { keyPath: "id" })
      studies.createIndex("id", "id", { unique: true })
    }
    if (!lampDb.objectStoreNames.contains("participants")) {
      const participants = lampDb.createObjectStore("participants", { keyPath: "id" })
      participants.createIndex("id", "id", { unique: true })
      participants.createIndex("study_name", "study_name")
    }
    if (!lampDb.objectStoreNames.contains("activities")) {
      const activities = lampDb.createObjectStore("activities", { keyPath: "id" })
      activities.createIndex("id", "id")
      activities.createIndex("study_name", "study_name")
    }
    if (!lampDb.objectStoreNames.contains("sensors")) {
      const sensors = lampDb.createObjectStore("sensors", { keyPath: "id" })
      sensors.createIndex("id", "id")
      sensors.createIndex("study_name", "study_name")
    }
  },
})

class DBService {
  getAll(tablespace: any) {
    return dbPromise
      .then((db) => {
        return db.transaction(tablespace).objectStore(tablespace).getAll()
      })
      .catch((error) => {
        // Do something?
      })
  }

  updateValue(tablespace: any, newVal: any, key: string, conditionKey: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            ;(newVal[tablespace] || []).map((data) => {
              if (cursor.value[conditionKey] === data[conditionKey]) {
                let value = cursor.value
                value[key] = data[key]
                cursor.update(value)
              }
            })
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }

  update(tablespace: any, newVal: any, key: string, conditionKey: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            ;(newVal[tablespace] || []).map((data) => {
              if (cursor.key === data[conditionKey]) {
                let value = cursor.value
                value[key] = data[key]
                cursor.update(value)
              }
            })
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }
  updateMultipleKeys(tablespace: any, newVal: any, keys: Array<any>, conditionKey: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            ;(newVal[tablespace] || []).map((data) => {
              if (cursor.key === data[conditionKey]) {
                let value = cursor.value
                keys.forEach(function (eachKey) {
                  value[eachKey] = data[eachKey]
                })
                cursor.update(value)
              }
            })
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }
  get(tablespace: any, key: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readonly").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            if (cursor.key === key) {
              return cursor.value
            }
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }
  getDataByKey(tablespace: any, search: Array<string>, key: string) {
    let results = []
    return dbPromise
      .then(function (db) {
        var tx = db.transaction([tablespace], "readonly")
        var store = tx.objectStore(tablespace)
        return store.openCursor()
      })
      .then(function getValues(cursor) {
        if (!cursor) {
          return
        }
        if (search.includes(cursor.value[key])) {
          results.push(cursor.value)
        }
        return cursor.continue().then(getValues)
      })
      .then(function () {
        return results
      })
  }

  getData(tablespace: any, key: string) {
    return dbPromise
      .then((db) => {
        return db.transaction([tablespace], "readonly").objectStore(tablespace).get(key)
      })
      .catch((error) => {
        // Do something?
      })
  }

  addData(tablespace: any, data: any) {
    return dbPromise
      .then((db) => {
        let store = db.transaction(tablespace, "readwrite").objectStore(tablespace)
        data.map((d) => {
          store.put(d)
        })
      })
      .catch((error) => {
        // Do something?
      })
  }

  addRow(tablespace: any, data: any) {
    return dbPromise
      .then((db) => {
        let store = db.transaction(tablespace, "readwrite").objectStore(tablespace)
        store.put(data)
      })
      .catch((error) => {
        // Do something?
      })
  }

  delete(tablespace: any, keys: any) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            if (keys.includes(cursor.key)) {
              cursor.delete()
            }
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }

  deleteByKey(tablespace: any, keys: any, conditionKey: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            if (keys.includes(cursor.value[conditionKey])) {
              cursor.delete()
            }
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }

  updateCount(tablespace: any, key: string, keyToUpdate: string, count?: number, type?: number) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            if (cursor.key === key) {
              let value = cursor.value
              value[keyToUpdate] = !!type ? value[keyToUpdate] - (count ?? 1) : value[keyToUpdate] + (count ?? 1)
              cursor.update(value)
            }
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }

  updateValues(tablespace: any, newVal: any, keys: Array<any>) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            ;(newVal[tablespace] || []).map((data) => {
              let value = cursor.value
              keys.forEach(function (eachKey) {
                value[eachKey] = data[eachKey]
              })
              cursor.update(value)
            })
            cursor = await cursor.continue()
          }
        })()
      })
      .catch((error) => {
        // Do something?
      })
  }

  deleteDB() {
    return dbPromise
      .then((db) => {
        const stores = [...db.objectStoreNames]
        stores.map((store) => {
          db.transaction([store], "readwrite").objectStore(store).clear()
        })
      })
      .catch((error) => {
        // Do something?
      })
  }
}

export const Service = new DBService()
