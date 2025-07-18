import { userDbPromise } from "./UserDB"
import { dbPromise } from "./AdminDB"

class DBService {
  getAll(tablespace: any, user?: boolean) {
    return dbPromise
      .then((db) => {
        try {
          return db.transaction(tablespace).objectStore(tablespace).getAll()
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  getAllTags(tablespace: any, user?: boolean) {
    return userDbPromise
      .then((db) => {
        try {
          return db.transaction(tablespace).objectStore(tablespace).getAll()
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  updateValue(tablespace: any, newVal: any, key: string, conditionKey: string) {
    return dbPromise
      .then((db) => {
        return (async () => {
          try {
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
          } catch (error) {
            console.log(error)
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
        return (async () => {
          try {
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
          } catch (error) {
            console.log(error)
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
        return (async () => {
          try {
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
          } catch (error) {
            console.log(error)
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
        return (async () => {
          try {
            let store = db.transaction([tablespace], "readonly").objectStore(tablespace)
            let cursor = await store.openCursor()
            while (cursor) {
              if (cursor.key === key) {
                return cursor.value
              }
              cursor = await cursor.continue()
            }
          } catch (error) {
            console.log(error)
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
        try {
          var tx = db.transaction([tablespace], "readonly")
          var store = tx.objectStore(tablespace)
          return store.openCursor()
        } catch (error) {
          console.log(error)
        }
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

  getUserDataByKey(tablespace: any, search: Array<string>, key: string) {
    let results = []
    return userDbPromise
      .then(function (db) {
        try {
          var tx = db.transaction([tablespace], "readonly")
          var store = tx.objectStore(tablespace)
          return store.openCursor()
        } catch (error) {
          console.log(error)
        }
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
        try {
          return db.transaction([tablespace], "readonly").objectStore(tablespace).get(key)
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  getActivityEventData(tablespace: any, key: string) {
    return userDbPromise
      .then(async (db) => {
        try {
          return (await db.transaction([tablespace], "readonly").objectStore(tablespace).getAll()).filter(
            (event) => event.activity === key
          )
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  addData(tablespace: any, data: any) {
    return dbPromise
      .then((db) => {
        try {
          let store = db.transaction(tablespace, "readwrite").objectStore(tablespace)
          data.map((d) => {
            store.put(d)
          })
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  addUserData(tablespace: any, data: any, user?: boolean) {
    return userDbPromise
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

  addUserDBRow(tablespace: any, data: any) {
    return userDbPromise
      .then((db) => {
        try {
          let store = db.transaction(tablespace, "readwrite").objectStore(tablespace)
          store.put(data)
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  addRow(tablespace: any, data: any) {
    return dbPromise
      .then((db) => {
        try {
          let store = db.transaction(tablespace, "readwrite").objectStore(tablespace)
          store.put(data)
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  delete(tablespace: any, keys: any) {
    return dbPromise
      .then((db) => {
        return (async () => {
          try {
            let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
            let cursor = await store.openCursor()
            while (cursor) {
              if (keys.includes(cursor.key)) {
                cursor.delete()
              }
              cursor = await cursor.continue()
            }
          } catch (error) {
            console.log(error)
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
        return (async () => {
          try {
            let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
            let cursor = await store.openCursor()
            while (cursor) {
              if (keys.includes(cursor.value[conditionKey])) {
                cursor.delete()
              }
              cursor = await cursor.continue()
            }
          } catch (error) {
            console.log(error)
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
        return (async () => {
          try {
            let store = db.transaction([tablespace], "readwrite").objectStore(tablespace)
            let cursor = await store.openCursor()
            while (cursor) {
              if (cursor.key === key) {
                let value = cursor.value
                let res = !!type ? value[keyToUpdate] - (count ?? 1) : value[keyToUpdate] + (count ?? 1)
                value[keyToUpdate] = res >= 0 ? res : 0
                cursor.update(value)
              }
              cursor = await cursor.continue()
            }
          } catch (error) {
            console.log(error)
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
        return (async () => {
          try {
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
          } catch (error) {
            console.log(error)
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
        try {
          const stores = [...db.objectStoreNames]
          stores.map((store) => {
            db.transaction([store], "readwrite").objectStore(store).clear()
          })
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }

  deleteUserDB() {
    return userDbPromise
      .then((db) => {
        try {
          const stores = [...db.objectStoreNames]
          stores.map((store) => {
            db.transaction([store], "readwrite").objectStore(store).clear()
          })
        } catch (error) {
          console.log(error)
        }
      })
      .catch((error) => {
        // Do something?
      })
  }
}

export const Service = new DBService()
