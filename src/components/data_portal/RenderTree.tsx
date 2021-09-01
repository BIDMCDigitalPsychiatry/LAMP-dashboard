import React from "react"
import {
  Typography,
  Card,
  CardHeader,
  CardActions,
  Icon,
  IconButton,
  FormControlLabel,
  makeStyles,
  TextField,
  ClickAwayListener,
  Switch,
} from "@material-ui/core"
import { tags_object, queryables_array, tagged_entities } from "./DataPortalShared"
import { useDrag, DragPreviewImage } from "react-dnd"
import SelectionWindow from "./SelectionWindow"
import LAMP from "lamp-core"
import { generate_ids } from "./DataPortalShared"

import { saveAs } from "file-saver"

export default function RenderTree({ id, type, token, name, onSetQuery, onUpdateGUI, isGUIEditor, ...props }) {
  const [treeDisplay, setTree] = React.useState(null)
  const [expanded, setExpanded] = React.useState(false)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TARGETINFO",
    item: { target: id[id.length - 1], type, name, id_string: id },
    canDrag:
      !expanded &&
      !Object.keys(tags_object).includes(id[id.length - 1]) &&
      id[id.length - 1] !== "Administrator" &&
      !queryables_array.includes(id[id.length - 1]),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  const [showFilter, toggleShowFilter] = React.useState(false)
  const [currentFilter, setCurrentFilter] = React.useState("")
  const useStyles = makeStyles((theme) => ({
    treeCard: {
      width: `${100 - 2 * (id.length > 2 ? 1 : 0)}%`,
      marginLeft: `${2 * (id.length > 2 ? 1 : 0)}%`,
      marginTop: "5px",
    },
    cardActions: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
      float: "right",
      marginTop: "0px",
    },
    treeButton: {
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
    treeFilter: {
      position: "fixed",
      top: "50vh",
      left: "30vw",
      width: "50vw",
      paddingTop: "5px",
      height: "60px",
      background: "white",
      "&:hover": {
        backgroundColor: "#eee",
      },
      border: "1px solid black",
      borderRadius: "3px",
      paddingLeft: "10px",
      zIndex: 1111,
    },
    cardHeader: {
      display: "flex",
      flexGrow: 3,
      flexDirection: "row",
      marginBottom: "0px",
      marginRight: "5px",
      fontSize: "16px",
      wordBreak: "break-word",
      height: "100%",
      "& span.MuiCardHeader-title": { fontSize: "16px", fontWeight: 500 },
    },
  }))
  const classes = useStyles()
  //let's define our function we'll use to ping the api
  const getData = async (query) => {
    try {
      let res = await fetch(`https://${token.server}`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${token.username}:${token.password}`,
        },
        body: query,
      })
      return JSON.parse(await res.text())
    } catch (err) {
      console.log("Data could not be loaded. Err: " + err)
      return []
    }
  }

  // We have two main cases we need to address in this function,
  // depending on whether the user wants to see the info available about
  // something static (e.g. a researcher) or dynamic (e.g. a participant)

  //First, if the item clicked on is static
  //we create the tree by getting the array of queries
  //that can be
  if (type === "Administrator") {
    React.useEffect(() => {
      if (!expanded) return
      //console.log("Getting admin options")
      setTree(tags_object[type])
    }, [expanded])
  } else if (Object.keys(tags_object).includes(id[id.length - 1])) {
    //then call the api
    React.useEffect(() => {
      if (!expanded) return
      //console.log(`Calling API to show array of ${id[id.length - 1]}`)
      let testQuery =
        id[id.length - 1] === "Researcher"
          ? `$LAMP.Researcher.list()`
          : id[id.length - 1] === "Study"
          ? `$LAMP.Study.list("${id[id.length - 2]}")`
          : id[id.length - 1] === "Participant"
          ? `$LAMP.Participant.list("${id[id.length - 2]}")`
          : `$LAMP.${id[id.length - 1]}.list("${id[id.length - 2]}")`
      getData(testQuery).then((res) => setTree(res))
    }, [expanded])
  } else if (queryables_array.includes(id[id.length - 1])) {
    //then call the api
    React.useEffect(() => {
      if (!expanded) return
      let testQuery = `$LAMP.${id[id.length - 1]}.list("${id.length >= 2 ? id[id.length - 2] : ""}")`
      onSetQuery(testQuery)
    }, [expanded])
  }
  //if it is not (i.e. it is dynamic), we return an array of objects
  //corresponding to each element
  else {
    React.useEffect(() => {
      if (!expanded) return
      //(`Getting static options for id: ${id[id.length-2]}`)
      setTree(tags_object[id[id.length - 2]])
    }, [expanded])
  }

  let dateObj = new Date()
  let month = dateObj.getMonth() + 1 //months from 1-12
  let day = dateObj.getDate()
  let year = dateObj.getFullYear()
  let newdate = month + "_" + day + "_" + year
  async function downloadData(id, name = "LAMP_Activity_Data" + newdate + ".csv") {
    //TODO: add selection between one big file and multiple files
    //TODO: add json vs csv selection
    console.log(`Downloading data for ${id}`)

    //first, let's generate a complete id list
    let id_list = await generate_ids(id)
    console.log(id_list)

    //now, let's pull some data
    let resultsPulled = await Promise.all(
      id_list.map(async (id) => {
        let res = await LAMP.ActivityEvent.allByParticipant(id)
        return {
          userID: id,
          activityEvents: res,
        }
      })
    )

    console.log(resultsPulled)

    let csv = [
      ["ID", "Activity Events"],
      ...resultsPulled.map((object) => [object["userID"], JSON.stringify(object["activityEvents"])]),
    ]
      .map((row) => row.join(","))
      .join("\n")
    debugger
    const file = new Blob([csv], { type: "text/csv" })
    name.endsWith(".csv") ? saveAs(file, name) : saveAs(file, name + ".csv")
  }

  return (
    <Card ref={drag} key={"div" + id[id.length - 1]} raised={true} className={classes.treeCard}>
      <CardHeader
        className={classes.cardHeader}
        key={"text" + id[id.length - 1]}
        title={`${name ? name : id[id.length - 1]}`}
      />
      <CardActions className={classes.cardActions}>
        {Object.keys(tags_object).includes(id[id.length - 1]) && id[id.length - 1] !== "Administrator" && (
          <IconButton className={classes.treeButton} onClick={() => toggleShowFilter(!showFilter)}>
            <Icon>search</Icon>
          </IconButton>
        )}
        {showFilter && (
          <ClickAwayListener onClickAway={() => toggleShowFilter(!showFilter)}>
            <TextField
              className={classes.treeFilter}
              value={currentFilter}
              onChange={(e) => {
                setCurrentFilter(e.target.value)
              }}
              placeholder={`Search ${id[id.length - 1]} list`}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <React.Fragment>
                    <IconButton className={classes.treeButton} onClick={() => setCurrentFilter("")}>
                      <Icon>backspace</Icon>
                    </IconButton>
                    <IconButton className={classes.treeButton} onClick={() => toggleShowFilter(!showFilter)}>
                      <Icon>close</Icon>
                    </IconButton>
                  </React.Fragment>
                ),
              }}
            />
          </ClickAwayListener>
        )}

        {!Object.keys(tags_object).includes(id[id.length - 1]) && Object.keys(tags_object).includes(id[id.length - 2]) && (
          <SelectionWindow
            openButtonText={`Download ${id[id.length - 2]} data`}
            customButton={
              <IconButton className={classes.treeButton}>
                <Icon>get_app</Icon>
              </IconButton>
            }
            displaySubmitButton={true}
            handleResult={() => downloadData(id[id.length - 1])}
            closesOnSubmit={false}
            exposeButton={true}
            submitText={`Download`}
            children={
              <Typography>
                Download Data for {id[id.length - 2]} {name ? name : id[id.length - 1]}
              </Typography>
            }
          />
        )}

        {isGUIEditor &&
          !Object.keys(tags_object).includes(id[id.length - 1]) &&
          Object.keys(tags_object).includes(id[id.length - 2]) && (
            <IconButton
              className={classes.treeButton}
              onClick={() =>
                onUpdateGUI({
                  _update: ["target", "type", "name", "id_string"],
                  content: [id[id.length - 1], type, name, id],
                })
              }
            >
              <Icon>arrow_forward</Icon>
            </IconButton>
          )}

        <IconButton className={classes.treeButton} onClick={() => setExpanded(!expanded)}>
          {queryables_array.includes(id[id.length - 1]) ? (
            !isGUIEditor ? (
              <Icon>arrow_forward</Icon>
            ) : null
          ) : expanded ? (
            <Icon>expand_less</Icon>
          ) : (
            <Icon>expand_more</Icon>
          )}
        </IconButton>
      </CardActions>
      {/*
						For each branch in our tree, we output some info and create a new level
						*/}
      {expanded &&
        (!!treeDisplay ? treeDisplay : []).map(
          (branch, index) =>
            (!currentFilter ||
              currentFilter === "" ||
              branch.id.indexOf(currentFilter) !== -1 ||
              (typeof branch !== "string" && branch.name.indexOf(currentFilter) !== -1)) && (
              <RenderTree
                key={"tree" + id[id.length - 1] + index}
                id={typeof branch === "string" ? [...id, branch] : [...id, branch.id]}
                name={typeof branch === "string" ? branch : branch.name}
                type={typeof branch === "string" ? branch : branch.id}
                token={token}
                onSetQuery={onSetQuery}
                onUpdateGUI={onUpdateGUI}
                isGUIEditor={isGUIEditor}
              />
            )
        )}
    </Card>
  )
}
