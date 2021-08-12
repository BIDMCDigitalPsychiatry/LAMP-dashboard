import React from "react"
import {
  Typography,
  Card,
  Select,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  Button,
  InputLabel,
  MenuItem,
  Checkbox,
  Box,
  Input,
  Icon,
} from "@material-ui/core"
import { tagged_entities, ajaxRequest } from "./DataPortalShared"

export default function QueryBuilder(props) {
  //this tracks the current query
  const [currentQuery, setCurrentQuery] = React.useState(props.query)

  //If true, we analyse "shared" data for researchers/studies. Study,Researcher default
  //If false, we analyse specific data. Participant default
  const [analyzeShared, setAnalyzeShared] = React.useState(
    !!(
      currentQuery.id_string &&
      currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() !== "participant"
    )
  )

  const [availableSharedTags, setSharedTags] = React.useState([])
  const [sharedTagsLoaded, setSharedTagsLoadedStatus] = React.useState(false)
  const [selectedSharedTags, setSelectedSharedTags] = React.useState([])

  //this next set of variables handles processing
  // the tags associated w/ a given ID
  const [availableTags, setTags] = React.useState([])
  const [tagsLoaded, setTagLoadedStatus] = React.useState(false)
  const [tagObject, setTagObject] = React.useState({})
  const [checkedCategories, setCheckedCategories] = React.useState([])
  //when the list of available tags change,
  //we update a tag variable to display info
  React.useEffect(() => {
    if (availableTags.length) {
      let tagObjectProcessor = {}
      availableTags.forEach(function (value) {
        let name = value.slice(value.lastIndexOf(".") + 1)
        let category_pre = value.slice(0, value.lastIndexOf(name) - 1)
        let category = category_pre.slice(category_pre.lastIndexOf(".") + 1)
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

  function setLoadedStatuses(bool) {
    setSharedTagsLoadedStatus(bool)
    setTagLoadedStatus(bool)
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
    setLoadedStatuses(false)
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
          setTagLoadedStatus(true)
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
            setSharedTagsLoadedStatus(true)
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

    const handleChange = (event) => {
      props.setCheckedCategories(event.target.value)
    }

    //this function load or unloads a clicked tag.
    const prepareTag = async (tagName) => {
      props.resetSharedTags()
      //TODO: disable button to prevent multiple queries
      let identifier = `${props.currentQuery.target}-${tagName}`
      let tagQuery = `$LAMP.Tag.get('${props.currentQuery.target}','${tagName}')`

      let sending = {
        method: "POST",
        url: `https://${props.token.server}/`,
        headers: [["Authorization", `Basic ${props.token.username}:${props.token.password}`]],
        data: tagQuery,
        callback: function (res) {
          props.setQueryResult(JSON.parse(res))
        },
      }
      ajaxRequest(sending)
      //if the tag is not currently in our list
      /*
            if (!isTagQueriedForUser(tagName,currentQuery.target)){
                //we get our data
                let tagQuery = `$LAMP.Tag.get('${currentQuery.target}','${tagName}')`


                let sending = {
                    method: 'POST',
                    url: `https://${props.token.server}/`,
                    headers: [["Authorization", `Basic ${props.token.username}:${props.token.password}`]],
                    data:tagQuery,
                    callback: function(res){
                        if (typeof props.queryResult !=='object')
                            props.setQueryResult({[identifier]: JSON.parse(res)})
                        else {
                            let combination = Object.assign(props.queryResult,{[identifier]: JSON.parse(res)})
                            console.log(combination)
                            props.setQueryResult(combination)
                        }
                        console.log(props.queryResult)
                    }
                }
                ajaxRequest(sending);
            }
            //if the tag currently is in our list
            else{
                props.setQueryResult(Object.keys(props.queryResult).reduce((obj, key) =>{
                    if (key !== identifier)
                        obj[key] = props.queryResult[key]
                    return obj;
                },{}));
            }*/
      //TODO: enable button after the other todo is completed
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

    return (
      <span>
        <FormControl key="tagForm" style={{ minWidth: "80%", maxWidth: "90%" }}>
          <InputLabel key="tagLabel" id="tag-selector">
            {Object.keys(props.tagObject).length ? `Select tag categories` : `No tags found`}
          </InputLabel>
          <Select
            multiple
            value={props.checkedCategories}
            key="tagSelect"
            onChange={handleChange}
            input={<Input />}
            style={{ minWidth: "80%", maxWidth: "90%" }}
            MenuProps={MenuProps}
            //@ts-ignore: selected will be a array here
            renderValue={(selected) => selected.join(", ")}
          >
            {Object.keys(props.tagObject).map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox key={name + "Checkbox"} checked={props.checkedCategories.indexOf(name) > -1} />
                {name.slice(0, 1).toUpperCase() + name.slice(1, name.length)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        {checkedCategories.map((name) => (
          <span key={name + "Category"}>
            <h3>{name.slice(0, 1).toUpperCase() + name.slice(1, name.length)}</h3>
            {props.tagObject[name].map((array) => (
              <span key={array[0] + "span"}>
                <Button key={array[1] + "button"} onClick={() => prepareTag(array[1])}>
                  {/*<Checkbox checked={isTagQueriedForUser(array[1],currentQuery.target)} />*/ array[0]}
                </Button>
                <br />
              </span>
            ))}
            <br />
          </span>
        ))}
      </span>
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

    //Here, we query the db for study-wide tags
    const handleChange = (event) => {
      //if we are loading new data, set loading to true
      if (props.selectedSharedTags.length < event.target.value.length) props.setLoadingGraphs(true)
      props.setSelectedSharedTags(event.target.value)
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

    return (
      <span>
        {props.selectedSharedTags.length >= Math.floor(props.availableSharedTags.length) / 2 ? (
          <Button onClick={uncheckAllTags}>Deselect all shared tags</Button>
        ) : (
          <Button onClick={checkAllTags}>Select all shared tags</Button>
        )}
        <br />
        <FormControl key="tagForm" style={{ minWidth: "80%", maxWidth: "90%" }}>
          <InputLabel key="tagLabel" id="tag-selector">
            {props.availableSharedTags.length
              ? `Select ${props.currentQuery.id_string[props.currentQuery.id_string.length - 2]}-wide tags`
              : `No ${props.currentQuery.id_string[props.currentQuery.id_string.length - 2]}-wide tags found`}
          </InputLabel>
          <Select
            multiple
            value={props.selectedSharedTags}
            key="tagSelect"
            onChange={handleChange}
            input={<Input />}
            style={{ minWidth: "80%", maxWidth: "90%" }}
            MenuProps={MenuProps}
            //@ts-ignore: selected will be an array here, so the join method exists
            renderValue={(selected) => selected.join(", ")}
          >
            {props.availableSharedTags.map((name) => (
              //@ts-ignore:
              <MenuItem key={name} value={name} name={name}>
                <Checkbox key={name + "Checkbox"} checked={props.selectedSharedTags.indexOf(name) > -1} />
                {name.slice(0, 1).toUpperCase() + name.slice(1, name.length)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
      </span>
    )
  }

  return (
    <Box>
      {currentQuery.target.length > 0 ? (
        <Card variant="outlined" style={{ margin: "0% 5%" }}>
          <Typography style={{ fontWeight: 600 }}>
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

          {sharedTagsLoaded &&
            tagged_entities.includes(currentQuery.id_string[currentQuery.id_string.length - 2]) &&
            analyzeShared &&
            currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() !== "participant" && (
              <DisplaySharedData
                style={{ flex: "1", minWidth: "80%" }}
                currentQuery={currentQuery}
                tagObject={tagObject}
                setLoadingGraphs={props.setLoadingGraphs}
                availableSharedTags={availableSharedTags}
                selectedSharedTags={selectedSharedTags}
                setSelectedSharedTags={setSelectedSharedTags}
                queryResult={props.queryResult}
                setQueryResult={props.setQueryResult}
                token={props.token}
              />
            )}
          {tagsLoaded &&
            tagged_entities.includes(currentQuery.id_string[currentQuery.id_string.length - 2]) &&
            (!analyzeShared ||
              currentQuery.id_string[currentQuery.id_string.length - 2].toLowerCase() === "participant") && (
              <DisplayTags
                style={{ flex: "1", minWidth: "80%" }}
                currentQuery={currentQuery}
                tagObject={tagObject}
                resetSharedTags={() => setSelectedSharedTags([])}
                checkedCategories={checkedCategories}
                setCheckedCategories={setCheckedCategories}
                queryResult={props.queryResult}
                setQueryResult={props.setQueryResult}
                token={props.token}
              />
            )}

          {
            !tagsLoaded && !sharedTagsLoaded && <Typography>Please wait, data is loading...</Typography> //insert additional loads here
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
            2. Click on <Icon>subdirectory_arrow_right</Icon>
          </Typography>
        </Card>
      )}
    </Box>
  )
}
