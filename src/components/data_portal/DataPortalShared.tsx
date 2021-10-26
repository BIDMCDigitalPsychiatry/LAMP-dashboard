import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core"
import LAMP from "lamp-core"

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

const focusedQueryBuilderHeight = "75%"
const unfocusedQueryBuilderHeight = "25%"
const focusedQueryRenderHeight = "75%"
const unfocusedQueryRenderHeight = "25%"

export const portalHomeStyle = makeStyles((theme) => ({
  box: {
    background: "inherit",
    userSelect: "text",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  queryWrapperBox: {
    flexGrow: 1,
    height: "calc(100% - 45px)",
    marginTop: 10,
  },
  toolbar: {
    height: "35px",
    minHeight: "35px",
  },
  alphaBadge: {
    right: -theme.spacing(2),
    color: "#fff",
  },
  icon: {
    right: -theme.spacing(2),
  },
  columnsGrid: {
    height: "100%",
    flexWrap: "nowrap",
    spacing: "1",
  },
  treeColumn: {
    maxHeight: "90vh",
    flexWrap: "nowrap",
    overFlowY: "scroll",
  },
  queryColumn: { height: "100%", userSelect: "text", flexWrap: "nowrap", maxHeight: "90vh" },
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
  collapseTree: {
    background: "#fff",
    borderRadius: "40px",
    boxShadow: "none",
    cursor: "pointer",
    textTransform: "capitalize",
    fontSize: "14px",
    color: "#7599FF",
    "& svg": { marginRight: 8 },
    "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
  },
  builderStyleFocus: {
    animation: `$myEffect 1000ms ${theme.transitions.easing.easeInOut}`,
    overflowY: "scroll",
    border: "1px solid black",
    borderRadius: "5px",
    height: focusedQueryBuilderHeight,
  },
  builderStyleUnfocus: {
    animation: `$myEffectExit 1000ms ${theme.transitions.easing.easeInOut}`,
    overflowY: "scroll",
    border: "1px solid black",
    borderRadius: "5px",
    height: unfocusedQueryBuilderHeight,
  },
  "@keyframes myEffect": {
    "0%": {
      height: unfocusedQueryBuilderHeight,
    },
    "100%": {
      height: focusedQueryBuilderHeight,
    },
  },
  "@keyframes myEffectExit": {
    "0%": {
      height: focusedQueryBuilderHeight,
    },
    "100%": {
      height: unfocusedQueryBuilderHeight,
    },
  },
  renderStyleFocus: {
    animation: `$focusRender 1000ms ${theme.transitions.easing.easeInOut}`,
    overflowY: "scroll",
    background: "white",
    border: "1px solid black",
    borderRadius: "5px",
    height: focusedQueryRenderHeight,
  },
  renderStyleUnfocus: {
    animation: `$unfocusRender 1000ms ${theme.transitions.easing.easeInOut}`,
    overflowY: "scroll",
    background: "white",
    border: "1px solid black",
    borderRadius: "5px",
    height: unfocusedQueryRenderHeight,
  },
  "@keyframes focusRender": {
    "0%": {
      height: unfocusedQueryRenderHeight,
    },
    "100%": {
      height: focusedQueryRenderHeight,
    },
  },
  "@keyframes unfocusRender": {
    "0%": {
      height: focusedQueryRenderHeight,
    },
    "100%": {
      height: unfocusedQueryRenderHeight,
    },
  },
}))

export const standaloneStyle = makeStyles((theme: Theme) =>
  createStyles({
    standaloneContainer: {
      height: "100vh",
    },
  })
)

//given a valid researcher, study, or participant id,
//an array of participant ids is returned
export async function generate_ids(id_set, return_with_names = false) {
  if (typeof id_set === "string") {
    let { data: parents } = await LAMP.Type.parent(id_set)
    //if study exists, return id_set
    if (parents?.Study) {
      if (return_with_names) {
        let result = await LAMP.Type.getAttachment(id_set, "lamp.name")
        return { [id_set]: result["data"] ? result["data"] : null }
      } else return [id_set]
    }
    //else if researcher exists
    //this is a study
    else if (parents?.Researcher) {
      let res = await LAMP.Participant.allByStudy(id_set)
      if (return_with_names) {
        let resObj = (await Promise.all(
          res.map((part) => {
            return LAMP.Type.getAttachment(part.id, "lamp.name").then((result) => {
              return { [part.id]: result["data"] ? result["data"] : null }
            })
          })
        )) as Array<object>
        return resObj.reduce((acc, elem) => {
          return { ...acc, ...elem }
        }, {})
      } else return res.map((participant) => participant.id)
    }
    //if nothing exists, this is a researcher, so we recursively call
    else {
      let res = await LAMP.Study.allByResearcher(id_set)
      return await generate_ids(
        res.map((study) => study.id),
        return_with_names
      )
    }
  } else if (Array.isArray(id_set)) {
    const res = await Promise.all(id_set.map((id) => generate_ids(id, return_with_names)))
    //now, res is an array of arrays, or an array of objects. let's combine them
    if (return_with_names) {
      return res.reduce((acc, obj) => {
        return { ...acc, ...obj }
      }, {})
    } else return res.reduce((acc, array) => acc.concat(array), [])
  } else {
    return [id_set]
  }
}

//given a valid researcher, study, or participant id,
//an array of study ids is returned
export async function generate_study_ids(id_set) {
  if (typeof id_set === "string") {
    let { data: parents } = await LAMP.Type.parent(id_set)
    //if study exists, return study, this is a participant
    if (parents?.Study) return [parents.Study]
    //else if researcher exists
    //this is a study, so we return id_set
    else if (parents?.Researcher) {
      return [id_set]
    }
    //if nothing exists, this is a researcher, so we get the list of studies
    //under their purview and return that
    else {
      let res = await LAMP.Study.allByResearcher(id_set)
      return res.map((study) => study.id)
    }
  } else if (Array.isArray(id_set)) {
    const res = await Promise.all(id_set.map((id) => generate_study_ids(id)))
    //now, res is an array of arrays. let's combine them
    return res.reduce((acc, array) => acc.concat(array), [])
  } else {
    return [id_set]
  }
}

//given an id or array of ids, returns a dictionary containing
//key value pairs of activity ids and activity names
export async function generate_activity_dict(id_set, already_reduced = false) {
  let id_list
  if (already_reduced) id_list = id_set
  else id_list = await generate_study_ids(id_set)

  //pull an array of arrays of studies
  const res = await Promise.all(id_list.map((id) => LAMP.Activity.allByStudy(id)))
  //flatten the array of arrays
  let studyArray = res.reduce((acc, array) => (acc as Array<any>).concat(array), [])
  //return a dictionary with activity ids and names
  return (studyArray as Array<any>).reduce((acc, example) => {
    return { ...acc, ...{ [example.id]: example.name } }
  }, {})
}

//this function takes a LAMP timestamp and returns
//a nicely formatted UTC string
export function ts_to_UTC_String(timestamp) {
  let date = new Date(timestamp)
  return date.toLocaleString()
}

//this function takes an object and returns an object
//with the same keys where the values have been stringified
export function stringify_obj_values(obj) {
  let res = {}
  Object.keys(obj).forEach((key) => (res[key] = JSON.stringify(obj[key])))
  return res
}

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

export const queryDictionary = {
  participantsWithName: function (id_string) {
    return `(
								$res := $LAMP.Participant.list('${id_string}').id;
								$array := $map($res,function($id){{'name': $LAMP.Tag.get($id,'lamp.name'),
																	'id':$id}})
								)`
  },
}

export function formatGraphName(tagName) {
  let newName = tagName
    .slice(tagName.lastIndexOf(".") + 1, tagName.length)
    .replace(/_/g, " ")
    .replace(/graph/g, "")
  return newName
    .split(" ")
    .map((elem) => elem.slice(0, 1).toUpperCase() + elem.slice(1))
    .join(" ")
}

export function formatTagName(tagName, returnCategoryOnly = true) {
  let categoryIndex = tagName.lastIndexOf(".")
  let newName = tagName
    .split(".")
    .map((elem) => elem.slice(0, 1).toUpperCase() + elem.slice(1))
    .join("-")
  if (returnCategoryOnly) return newName.slice(0, categoryIndex)
  else return newName
}
