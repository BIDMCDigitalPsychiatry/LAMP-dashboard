import React from "react"
import { makeStyles } from "@material-ui/core"

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}

//nicer ajaxRequest
export function ajaxRequest(parameters) {
  var method = parameters.method ? parameters.method : "GET"
  var data = parameters.data
    ? typeof parameters.data === "object"
      ? JSON.stringify(parameters.data)
      : parameters.data
    : ""
  var xmlhttp = new XMLHttpRequest()
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (parameters.callback) parameters.callback(this.responseText)
    } else if (this.readyState == 4 && this.status !== 200) {
      if (parameters.alternateCallback) parameters.alternateCallback(this.responseText)
      else if (parameters.callback) parameters.callback(this.responseText)
    }
  }
  //prepare the request
  xmlhttp.open(method ? method : "GET", parameters.url, parameters.async ? parameters.async : true)
  parameters.headers.forEach(function (array) {
    xmlhttp.setRequestHeader(array[0], array[1])
  })

  //send the request through "GET" or another method if specified
  if (method === "GET") xmlhttp.send()
  else if (method === "POST") xmlhttp.send(data)
}

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export const useStyles3 = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}))

export const tags_object = {
  Administrator: ["Researcher", "ActivitySpec", "SensorSpec"],
  Researcher: ["Study", "ActivitySpec", "SensorSpec"],
  Study: ["Participant", "ActivitySpec", "SensorSpec", "Activity", "Sensor"],
  Participant: ["ActivityEvent", "SensorEvent", "Activity", "Sensor"],
}

export const queryables_array = [
  "ActivitySpec",
  "SensorSpec",
  "Tag",
  "Activity",
  "Sensor",
  "ActivityEvent",
  "SensorEvent",
]

export const tagged_entities = ["Researcher", "Study", "Participant"]
