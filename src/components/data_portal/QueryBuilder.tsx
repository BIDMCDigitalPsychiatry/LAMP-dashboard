import React from "react"
import {
  Typography,
  Card,
  FormControlLabel,
  FormGroup,
  Switch,
  Button,
  Checkbox,
  Container,
  Icon,
  Backdrop,
  makeStyles,
  CardHeader,
  Box,
} from "@material-ui/core"
import { tagged_entities, ajaxRequest, formatGraphName, formatTagName } from "./DataPortalShared"
import { useDrop } from "react-dnd"

const useStyles = makeStyles((theme) => ({
  loadingBackdrop: {
    zIndex: theme.zIndex.drawer + 1,
    //position:'relative',
    color: "#fff",
  },
  tagCard: {
    flex: "25%",
    float: "left",
    fontSize: "10px",
    "&:hover": { background: "#eee", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
  },
  tagCardHeader: {
    fontSize: "10px",
    wordBreak: "break-word",
  },
  tagCheckbox: {
    color: "#7599FF",
    "&:checked": { color: "#7599FF" },
    "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
  },
  tagsBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    flexGrow: 1,
    float: "left",
    marginTop: "0px",
  },
  categoryBox: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    flexGrow: 1,
    float: "left",
  },
}))

export default function QueryBuilder(props) {
  //this tracks the current query
  const [currentQuery, setCurrentQuery] = React.useState(props.query)

  const classes = useStyles()
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "TARGETINFO",
    // Props to collect,
    drop: (item, monitor) => {
      setCurrentQuery(item)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  //If true, we analyse "shared" data for researchers/studies. Study,Researcher default
  //If false, we analyse specific data. Participant default
  const [analyzeShared, setAnalyzeShared] = React.useState(
    !!(
      currentQuery.id_string &&
      currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() !== "participant"
    )
  )

  const [availableSharedTags, setSharedTags] = React.useState([])
  const [sharedTagsLoading, setSharedTagsLoadingStatus] = React.useState(false)
  const [selectedSharedTags, setSelectedSharedTags] = React.useState([])

  //this next set of variables handles processing
  // the tags associated w/ a given ID
  const [availableTags, setTags] = React.useState([])
  const [tagsLoading, setTagLoadingStatus] = React.useState(false)
  const [tagObject, setTagObject] = React.useState({})
  const [checkedCategories, setCheckedCategories] = React.useState([])
  //when the list of available tags change,
  //we update a tag variable to display info
  React.useEffect(() => {
    if (availableTags.length) {
      let tagObjectProcessor = {}
      availableTags.forEach(function (value) {
        let name = value.slice(value.lastIndexOf(".") + 1)
        let category = value.slice(0, value.lastIndexOf(".") + 1)
        if (!tagObjectProcessor[category]) tagObjectProcessor[category] = [[name.replace(/_/g, " "), value]]
        else tagObjectProcessor[category].push([name.replace(/_/g, " "), value])
      })
      setTagObject(tagObjectProcessor)
    }
  }, [availableTags, availableSharedTags])

  React.useEffect(() => {
    setAnalyzeShared(
      !!(
        currentQuery.id_string &&
        currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() !== "participant"
      )
    )
  }, [currentQuery])

  function setLoadingStatuses(bool) {
    setSharedTagsLoadingStatus(bool)
    setTagLoadingStatus(bool)
  }

  //when our query is changed,
  //this function reflects that
  React.useEffect(() => {
    setCurrentQuery(props.query)
  }, [props.query])

  //This resets and prepares the
  //window when a new target is selected
  React.useEffect(() => {
    setTags([])
    setTagObject({})
    setCheckedCategories([])
    setSelectedSharedTags([])
    setSharedTags([])
    setLoadingStatuses(false)
    if (props.focusMe && typeof props.focusMe === "function") props.focusMe()
    props.setQueryResult("")
    if (currentQuery.target.length !== 0) {
      let testQuery = `$LAMP.Tag.list('${currentQuery.target}')`
      let tagSending = {
        method: "POST",
        url: `https://${props.token.server}/`,
        headers: [["Authorization", `Basic ${props.token.username}:${props.token.password}`]],
        data: testQuery,
        callback: function (res) {
          setTags(JSON.parse(res))
          setTagLoadingStatus(false)
        },
      }
      ajaxRequest(tagSending)

      if (currentQuery.id_string[currentQuery.id_string.length - 2] !== "Participant") {
        let sharedQuery = `($LAMP.Tag.get('${currentQuery.target}','lamp.dashboard.${currentQuery.id_string[
          currentQuery.id_string.length - 2
        ].toLowerCase()}_tags'))`
        let sharedSending = {
          method: "POST",
          url: `https://${props.token.server}/`,
          headers: [["Authorization", `Basic ${props.token.username}:${props.token.password}`]],
          data: sharedQuery,
          callback: function (res) {
            setSharedTags(JSON.parse(res))
            setSharedTagsLoadingStatus(false)
          },
        }
        ajaxRequest(sharedSending)
      }
    }
  }, [currentQuery.target])

  //This function handles displaying tag
  //data for the entities that can be tagged
  //(Researchers, Studies, and Users)
  const DisplayTags = (props) => {
    if (!props.tagObject || !Object.keys(props.tagObject).length) {
      return (
        <Typography>
          No tags are available for this{" "}
          {props.currentQuery.id_string[props.currentQuery.id_string.length - 2].toLowerCase()}
        </Typography>
      )
    }

    //this function load or unloads a clicked tag.
    const prepareTag = async (tagName) => {
      props.setLoadingGraphs(true)
      props.resetSharedTags()
      let tagQuery = `$LAMP.Tag.get('${props.currentQuery.target}','${tagName}')`

      let sending = {
        method: "POST",
        url: `https://${props.token.server}/`,
        headers: [["Authorization", `Basic ${props.token.username}:${props.token.password}`]],
        data: tagQuery,
        callback: function (res) {
          props.setLoadingGraphs(false)
          props.setQueryResult(JSON.parse(res))
        },
      }
      ajaxRequest(sending)
      //if the tag is not currently in our list
    }
    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    }

    function returnSortedTagObject(array) {
      let res = array.slice()
      res.sort((a, b) => formatGraphName(a[0]).localeCompare(formatGraphName(b[0])))
      return res
    }
    return (
      <Box className={classes.categoryBox}>
        {Object.keys(props.tagObject).map((category) => (
          <React.Fragment>
            <Typography>{category}</Typography>
            <Box className={classes.tagsBox}>
              {returnSortedTagObject(props.tagObject[category]).map((array) => {
                //let's format the names
                let printedName = formatGraphName(array[0])
                return (
                  <Card key={array[1]} className={classes.tagCard}>
                    <CardHeader
                      onClick={async () => {
                        await prepareTag(array[1])
                      }}
                      classes={{ title: classes.tagCardHeader }}
                      title={printedName}
                    />
                  </Card>
                )
              })}
            </Box>
            <br />
          </React.Fragment>
        ))}
      </Box>
    )
  }

  //This function handles displaying shared tag
  //data for a single study
  const DisplaySharedData = (props) => {
    if (!props.availableSharedTags) {
      return (
        <Typography>
          There are no shared tags set for this {currentQuery.id_string[currentQuery.id_string.length - 2]}. To display
          data on tags shared between participants, set "lamp.dashboard.
          {currentQuery.id_string[currentQuery.id_string.length - 2].slice(0, 1).toLowerCase() +
            currentQuery.id_string[currentQuery.id_string.length - 2].slice(1)}
          _tags" to an array of strings, where each string is a tag you would like to see. Please contact your study
          administrator for more info.
        </Typography>
      )
    }

    const addTag = (name) => {
      if (props.selectedSharedTags.indexOf(name) === -1) {
        props.setLoadingGraphs(true)
        props.setSelectedSharedTags(props.selectedSharedTags.concat([name]))
      }
    }
    const removeTag = (name) => {
      let index = props.selectedSharedTags.indexOf(name)
      if (index !== -1) {
        props.setSelectedSharedTags(props.selectedSharedTags.filter((elem) => elem !== name))
      }
    }

    React.useEffect(() => {
      if (props.selectedSharedTags.length === 0) {
        props.setQueryResult("")
        return
      }

      if (!Array.isArray(props.queryResult) && props.selectedSharedTags.length > 0) {
        props.setQueryResult([])
      }
      //if we have an array already
      if (Array.isArray(props.queryResult)) {
        //if the tag is already in our array of results
        //we are deselecting it and thus remove it here

        //get the difference between our desired array
        //and our current array
        let currentTags, removingTags, addingTags
        if (props.queryResult.length) currentTags = props.queryResult.map((elem) => elem["tag"])
        else currentTags = []

        if (currentTags.length)
          removingTags = currentTags.reduce(
            (acc, tag) => (props.selectedSharedTags.indexOf(tag) === -1 ? acc.concat(tag) : acc),
            []
          )
        else removingTags = []

        if (currentTags.length)
          addingTags = props.selectedSharedTags.reduce(
            (acc, tag) => (currentTags.indexOf(tag) === -1 ? acc.concat(tag) : acc),
            []
          )
        else addingTags = props.selectedSharedTags

        if (removingTags.length) {
          removingTags.forEach((targetTag) => {
            props.setQueryResult(props.queryResult.filter((obj) => obj["tag"] !== targetTag))
          })
        }

        if (addingTags.length) {
          //if the tag is not in our array of results
          //we query the db and find values for the tags
          let tagQuery

          //if study
          //TODO: find a more elegant way to do determine study vs researcher. probably w/ parent?
          if (currentQuery.id_string[currentQuery.id_string.length - 2] === "Study") {
            tagQuery = `(
								$res := $LAMP.Participant.list('${props.currentQuery.id_string[props.currentQuery.id_string.length - 1]}').id;
								$tagList := ${JSON.stringify(addingTags)};
								$array := $map($tagList,function($targetTag){
																	$map($res, function($id){{'result': $LAMP.Tag.get($id,$targetTag),
																	'tag': $targetTag,
																	'id':$id,
																	'alias':$LAMP.Tag.get($id,"lamp.name")}})})
								)`
          } else {
            //if researcher
            tagQuery = `(
								$studies := $LAMP.Study.list('${props.currentQuery.id_string[props.currentQuery.id_string.length - 1]}').id;
								$res := $map($studies, function($i){$LAMP.Participant.list($i)}).id;
								$tagList := ${JSON.stringify(addingTags)};
								$final := $map($tagList,function($targetTag){
																	$map($res, function($id){{'result': $LAMP.Tag.get($id,$targetTag),
																	'tag': $targetTag,
																	'id':$id,
																	'alias':$LAMP.Tag.get($id,"lamp.name"),
																	'study':$LAMP.Type.parent($id).Study}})})
									 )`
          }

          let sending = {
            method: "POST",
            url: `https://${props.token.server}/`,
            headers: [["Authorization", `Basic ${props.token.username}:${props.token.password}`]],
            data: tagQuery,
            callback: function (res) {
              //as we are no longer loading data, we set this to false
              props.setLoadingGraphs(false)
              //we remove all loading tags associated with this request
              if (res === "") return
              let tagsToAdd = JSON.parse(res)
              //if we return only one result, jsonata will just return an object
              //so we convert to an array here.
              if (!Array.isArray(tagsToAdd)) tagsToAdd = [tagsToAdd]

              // if we queried multiple things, jsonata returns an array of arrays
              // we reduce this here
              if (tagsToAdd.length && Array.isArray(tagsToAdd[0]))
                tagsToAdd = tagsToAdd.reduce((acc, tagList) => acc.concat(tagList), [])
              if (!Array.isArray(props.queryResult)) {
                props.setQueryResult(tagsToAdd)
              } else {
                //we set the new query result,
                // todo: filtering out duplicates
                props.setQueryResult([...props.queryResult, ...tagsToAdd])
              }
            },
          }
          ajaxRequest(sending)
        }
      }
    }, [])

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    }

    const uncheckAllTags = () => {
      props.setSelectedSharedTags([])
    }

    const checkAllTags = () => {
      props.setLoadingGraphs(true)
      props.setSelectedSharedTags(props.availableSharedTags)
    }

    function returnSortedTags(array) {
      let res = array.slice()
      res.sort((a, b) => formatGraphName(a).localeCompare(formatGraphName(b)))
      return res
    }

    return (
      <span>
        {props.selectedSharedTags.length >= Math.floor(props.availableSharedTags.length) / 2 ? (
          <Button onClick={uncheckAllTags}>Deselect all shared tags</Button>
        ) : (
          <Button onClick={checkAllTags}>Select all shared tags</Button>
        )}
        <br />
        <Box className={classes.tagsBox}>
          {returnSortedTags(props.availableSharedTags).map((name) => {
            //let's format the names
            let printedName = formatGraphName(name)
            return (
              <Card key={name} className={classes.tagCard}>
                <CardHeader
                  onClick={() => {
                    props.selectedSharedTags.indexOf(name) === -1 ? addTag(name) : removeTag(name)
                  }}
                  classes={{ title: classes.tagCardHeader }}
                  title={printedName}
                  action={
                    <Checkbox
                      className={classes.tagCheckbox}
                      color={"primary"}
                      checked={props.selectedSharedTags.indexOf(name) !== -1}
                    />
                  }
                />
              </Card>
            )
          })}
        </Box>
        <br />
      </span>
    )
  }

  return (
    <Container
      ref={drop}
      role={"QueryBuilder"}
      style={{ position: "relative", border: isOver ? "1 px solid green" : "white" }}
    >
      <Backdrop className={classes.loadingBackdrop} open={tagsLoading || sharedTagsLoading || props.loadingGraphs} />
      {currentQuery.target.length > 0 ? (
        <Card variant="outlined" style={{ margin: "0% 5%" }}>
          <Typography style={{ fontWeight: 600, userSelect: "text" }}>
            {`${
              currentQuery.id_string.length > 1 ? `${currentQuery.id_string[currentQuery.id_string.length - 2]}:` : ""
            }
												 ${currentQuery.name ? `${currentQuery.name} - (ID:${currentQuery.target})` : currentQuery.target}`}
          </Typography>
          {currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() !== "participant" && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch color="primary" checked={analyzeShared} onChange={() => setAnalyzeShared(!analyzeShared)} />
                }
                label={
                  analyzeShared
                    ? "Analyze Participant Data"
                    : `Analyze ${currentQuery.id_string[currentQuery.id_string.length - 2]} Data`
                }
              />
            </FormGroup>
          )}

          {!sharedTagsLoading &&
            tagged_entities.includes(currentQuery.id_string[currentQuery.id_string.length - 2]) &&
            analyzeShared &&
            currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() !== "participant" && (
              <DisplaySharedData
                style={{ flex: "1", minWidth: "80%" }}
                currentQuery={currentQuery}
                setLoadingGraphs={props.setLoadingGraphs}
                availableSharedTags={availableSharedTags}
                selectedSharedTags={selectedSharedTags}
                setSelectedSharedTags={setSelectedSharedTags}
                queryResult={props.queryResult}
                setQueryResult={props.setQueryResult}
                token={props.token}
              />
            )}
          {!tagsLoading &&
            tagged_entities.includes(currentQuery.id_string[currentQuery.id_string.length - 2]) &&
            (!analyzeShared ||
              currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() === "participant") && (
              <DisplayTags
                style={{ flex: "1", minWidth: "80%" }}
                currentQuery={currentQuery}
                tagObject={tagObject}
                resetSharedTags={() => setSelectedSharedTags([])}
                setLoadingGraphs={props.setLoadingGraphs}
                checkedCategories={checkedCategories}
                setCheckedCategories={setCheckedCategories}
                queryResult={props.queryResult}
                setQueryResult={props.setQueryResult}
                token={props.token}
              />
            )}

          {
            tagsLoading && sharedTagsLoading && <Typography>Please wait, data is loading...</Typography> //insert additional loads here
          }
          <br />
        </Card>
      ) : (
        <Card style={{ margin: "0% 5%" }}>
          <Typography>
            To start building a query:
            <br />
            1. Navigate to the level of your target on the left.
            <br />
            2. Click on <Icon>arrow_forward</Icon>
            <br />
            <br />
            Alternatively, drag and drop a researcher, study, or participant into this box.
          </Typography>
        </Card>
      )}
    </Container>
  )
}
