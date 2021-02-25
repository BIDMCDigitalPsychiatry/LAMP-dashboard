import * as idb from "idb"

const DATABASE_NAME = "LAMP-DB"

const dbPromise = idb.openDB(DATABASE_NAME, 1, {
  upgrade(upgradeDb) {
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
  getAll(tablespace) {
    return dbPromise
      .then((db) => {
        return db.transaction(tablespace).objectStore(tablespace).getAll()
      })
      .catch((error) => {
        // Do something?
      })
  }

  update(tablespace, newVal, key, conditionKey) {
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

  get(tablespace, key) {
    return dbPromise
      .then((db) => {
        console.log(key, db.transaction(tablespace).objectStore(tablespace).get(key))
        return db.transaction(tablespace).objectStore(tablespace).get(key)
      })
      .catch((error) => {
        // Do something?
      })
  }

  addData(tablespace, data) {
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
}

export const Service = new DBService()
