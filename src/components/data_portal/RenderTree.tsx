import React from "react"
import {
  Box,
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
  Tooltip,
  CardContent,
} from "@material-ui/core"
import { tags_object, queryables_array, tagged_entities } from "./DataPortalShared"
import { useDrag, DragPreviewImage } from "react-dnd"
import SelectionWindow from "./SelectionWindow"
import LAMP from "lamp-core"
import { generate_ids, useLocalStorage, queryDictionary } from "./DataPortalShared"

import { saveAs } from "file-saver"
import jsonexport from "jsonexport"

export default function RenderTree({ id, type, token, name, onSetQuery, onUpdateGUI, isGUIEditor, ...props }) {
  const [treeDisplay, setTree] = React.useState(null)
  const [expanded, setExpanded] = React.useState(false)
  const [isAlphabetized, toggleAlphabetized] = React.useState(
    Object.keys(tags_object).includes(id[id.length - 1]) && id[id.length - 1] !== "Administrator"
  )
  const [alphabetizedTree, setAlphabetizedTree] = React.useState(null)
  function alphabetizeTree(array) {
    if (!Array.isArray(array) || array.length === 1) return array
    let res = array.slice().sort((a, b) => (a.name ? a.name : a.id).localeCompare(b.name ? b.name : b.id))
    return res
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TARGETINFO",
    item: { target: id[id.length - 1], type, name, id_string: id },
    canDrag: () => {
      return (
        !expanded &&
        !Object.keys(tags_object).includes(id[id.length - 1]) &&
        id[id.length - 1] !== undefined &&
        id[id.length - 1] !== null &&
        name !== "Administrator" &&
        !queryables_array.includes(id[id.length - 1])
      )
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  const [showFilter, toggleShowFilter] = React.useState(false)
  const [currentFilter, setCurrentFilter] = React.useState("")
  const filterRef = React.useRef(null)

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
      flex: "auto",
      margin: "auto",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
    treeButtonHighlighted: {
      background: "#7599FF",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#fff",
      flex: "auto",
      margin: "auto",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#fff", background: "#5680f9", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
    treeFilter: {
      background: "white",
      "&:hover": {
        backgroundColor: "#eee",
      },
      borderRadius: "3px",
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
    downloadFormControl: {
      width: "100%",
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
      setTree(tags_object[type])
    }, [expanded])
  } else if (Object.keys(tags_object).includes(id[id.length - 1])) {
    //then call the api
    React.useEffect(() => {
      if (!expanded) return
      let testQuery =
        id[id.length - 1] === "Researcher"
          ? `$LAMP.Researcher.list()`
          : id[id.length - 1] === "Study"
          ? `$LAMP.Study.list("${id[id.length - 2]}")`
          : id[id.length - 1] === "Participant"
          ? queryDictionary.participantsWithName(id[id.length - 2])
          : `$LAMP.${id[id.length - 1]}.list("${id[id.length - 2]}")`
      getData(testQuery).then((res) => {
        if (!Array.isArray(res)) res = [res]
        setTree(res)
        setAlphabetizedTree(alphabetizeTree(res))
      })
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
  const defaultDownloadName = `LAMP_${name ? name.replace(" ", "_") : id[id.length - 1]}_Activity_Data_${newdate}.csv`
  const [downloadName, setDownloadName] = React.useState(defaultDownloadName)
  async function downloadData(id, name = "LAMP_Activity_Data" + newdate + ".csv", delimiter = ",", returnChar = "\n") {
    //TODO: add selection between one big file and multiple files
    //TODO: add json vs csv selection
    console.log(`Downloading data for ${id}`)

    //first, let's generate a complete id list
    let id_list = await generate_ids(id)

    //now, let's pull some data
    let resultsPulled = await Promise.all(
      id_list.map(async (id) => {
        let res = await LAMP.ActivityEvent.allByParticipant(id)
        return {
          userID: id,
          activityEvents: JSON.stringify(res),
        }
      })
    )

    jsonexport(resultsPulled, function (err, csv) {
      if (err) return console.log(err)
      const file = new Blob([csv], { type: "text/csv" })
      name.endsWith(".csv") ? saveAs(file, name) : saveAs(file, name + ".csv")
    })
  }

  React.useEffect(() => {
    if (showFilter && filterRef.current) filterRef.current.focus()
  }, [showFilter])

  const [copyText, setCopyText] = React.useState(`Copy ${id.length >= 2 ? id[id.length - 2] : ""} ID to clipboard`)

  return (
    <Card ref={drag} key={"div" + id[id.length - 1]} raised={true} className={classes.treeCard}>
      <CardHeader
        className={classes.cardHeader}
        key={"text" + id[id.length - 1]}
        title={`${name ? name : id[id.length - 1]}`}
        action={
          id.length >= 2 &&
          Object.keys(tags_object).includes(id[id.length - 2]) && (
            <Tooltip title={copyText}>
              <IconButton
                className={classes.treeButton}
                onClick={() => {
                  navigator.clipboard
                    .writeText(id[id.length - 1])
                    .then(() => {
                      setCopyText("Copied!")
                      setTimeout(() => {
                        setCopyText(`Copy ${id[id.length - 2]} ID to clipboard`)
                      }, 5000)
                    })
                    .catch(() => {
                      setCopyText("Unable to copy!")
                      setTimeout(() => {
                        setCopyText(`Copy ${id[id.length - 2]} ID to clipboard`)
                      }, 5000)
                    })
                }}
              >
                <Icon>content_copy</Icon>
              </IconButton>
            </Tooltip>
          )
        }
      />

      {showFilter && (
        <ClickAwayListener onClickAway={() => toggleShowFilter(currentFilter.length !== 0)}>
          <CardContent>
            {expanded && (
              <TextField
                className={classes.treeFilter}
                value={currentFilter}
                onChange={(e) => {
                  setCurrentFilter(e.target.value)
                }}
                label={`Filter ${id[id.length - 1]}s`}
                placeholder={`Search ${id[id.length - 1]} list`}
                inputRef={filterRef}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            )}
          </CardContent>
        </ClickAwayListener>
      )}
      <CardActions className={classes.cardActions} style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
        {Object.keys(tags_object).includes(id[id.length - 1]) && id[id.length - 1] !== "Administrator" && expanded && (
          <Tooltip title={isAlphabetized ? `Sort by date of creation` : `Alphabetize List`}>
            <IconButton
              className={isAlphabetized ? classes.treeButtonHighlighted : classes.treeButton}
              onClick={() => toggleAlphabetized(!isAlphabetized)}
            >
              <Icon>sort_by_alpha</Icon>
            </IconButton>
          </Tooltip>
        )}

        {Object.keys(tags_object).includes(id[id.length - 1]) && id[id.length - 1] !== "Administrator" && expanded && (
          <Tooltip title={`Filter${currentFilter.length ? `(currently:${currentFilter})` : ""}`}>
            <IconButton
              className={currentFilter.length ? classes.treeButtonHighlighted : classes.treeButton}
              onClick={() => {
                toggleShowFilter(!showFilter)
                setCurrentFilter("")
              }}
            >
              <Icon>search</Icon>
            </IconButton>
          </Tooltip>
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
            runOnOpen={() => {
              setDownloadName(defaultDownloadName)
            }}
            handleResult={() => downloadData(id[id.length - 1], downloadName)}
            closesOnSubmit={false}
            exposeButton={true}
            submitText={`Download`}
            children={
              <Typography>
                Download Data for {id[id.length - 2]} {name ? name : id[id.length - 1]}
                <br />
                <FormControlLabel
                  classes={{ root: classes.downloadFormControl }}
                  labelPlacement={"top"}
                  control={
                    <TextField
                      value={downloadName}
                      onChange={(e) => {
                        setDownloadName(e.target.value)
                      }}
                    />
                  }
                  label={
                    <Box component="span" fontWeight={600}>
                      File Name
                    </Box>
                  }
                />
              </Typography>
            }
          />
        )}

        {isGUIEditor &&
          !Object.keys(tags_object).includes(id[id.length - 1]) &&
          Object.keys(tags_object).includes(id[id.length - 2]) && (
            <Tooltip title={`Analyze ${id[id.length - 2]}`}>
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
            </Tooltip>
          )}

        <IconButton className={classes.treeButton} onClick={() => setExpanded(!expanded)}>
          {queryables_array.includes(id[id.length - 1]) ? (
            !isGUIEditor ? (
              <Tooltip title={`Load ${id[id.length - 1]} query for ${id[id.length - 2]} into terminal`}>
                <Icon>arrow_forward</Icon>
              </Tooltip>
            ) : null
          ) : expanded ? (
            <Tooltip title={"Collapse"}>
              <Icon>expand_less</Icon>
            </Tooltip>
          ) : (
            <Tooltip title={"Expand"}>
              <Icon>expand_more</Icon>
            </Tooltip>
          )}
        </IconButton>
      </CardActions>
      {/*
						For each branch in our tree, we output some info and create a new level
						*/}
      {expanded &&
        (!!treeDisplay ? (isAlphabetized && !!alphabetizedTree ? alphabetizedTree : treeDisplay) : []).map(
          (branch, index) =>
            (!currentFilter ||
              currentFilter === "" ||
              branch.id.indexOf(currentFilter) !== -1 ||
              (typeof branch !== "string" && branch.name && branch.name.indexOf(currentFilter) !== -1)) && (
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
