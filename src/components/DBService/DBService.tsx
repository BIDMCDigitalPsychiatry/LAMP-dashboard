import * as idb from "idb"
const DATABASE_NAME = "LAMP-DB"

const dbPromise = idb.openDB(DATABASE_NAME, 1, {
  upgrade(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("researcher")) {
      const researcher = upgradeDb.createObjectStore("researcher", { keyPath: "id" })
      researcher.createIndex("id", "id", { unique: true })
    }
    if (!upgradeDb.objectStoreNames.contains("studies")) {
      const studies = upgradeDb.createObjectStore("studies", { keyPath: "id" })
      studies.createIndex("id", "id", { unique: true })
    }
    if (!upgradeDb.objectStoreNames.contains("participants")) {
      const participants = upgradeDb.createObjectStore("participants", { keyPath: "id" })
      participants.createIndex("id", "id", { unique: true })
    }
    if (!upgradeDb.objectStoreNames.contains("activities")) {
      const activities = upgradeDb.createObjectStore("activities", { keyPath: "id" })
      activities.createIndex("id", "id")
    }
    if (!upgradeDb.objectStoreNames.contains("sensors")) {
      const sensors = upgradeDb.createObjectStore("sensors", { keyPath: "id" })
      sensors.createIndex("id", "id")
    }
  },
})

class DBService {
  getAll(tablespace: string) {
    return dbPromise
      .then((db) => {
        return db.transaction(tablespace).objectStore(tablespace).getAll()
      })
      .catch((error) => {
        // Do something?
      })
  }

  update(tablespace: string, newVal: any, key: string, conditionKey: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            newVal[tablespace].map((data) => {
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

  updateMultipleKeys(tablespace: string, newVal: any, keys: Array<any>, conditionKey: string) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            newVal[tablespace].map((data) => {
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

  get(tablespace: string, key: string) {
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

  getDataByKey(tablespace: string, search: Array<string>, key: string) {
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

  getData(tablespace: string, key: string) {
    return dbPromise
      .then((db) => {
        return db.transaction([tablespace], "readonly").objectStore(tablespace).get(key)
      })
      .catch((error) => {
        // Do something?
      })
  }

  addData(tablespace: string, data: any) {
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

  addRow(tablespace: string, data: any) {
    return dbPromise
      .then((db) => {
        let store = db.transaction(tablespace, "readwrite").objectStore(tablespace)
        store.put(data)
      })
      .catch((error) => {
        // Do something?
      })
  }

  delete(tablespace: string, keys: any) {
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

  updateCount(tablespace: string, key: string, keyToUpdate: string, count?: number, type?: number) {
    return dbPromise
      .then((db) => {
        ;(async () => {
          let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
          let cursor = await store.openCursor()
          while (cursor) {
            if (cursor.key === key) {
              let value = cursor.value
              value[keyToUpdate] = !type ? value[keyToUpdate] + (count ?? 1) : value[keyToUpdate] + (count ?? 1)
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
}

export const Service = new DBService()
