import React from "react"
import { Typography, Card, Icon, IconButton } from "@material-ui/core"
import { tags_object, queryables_array, tagged_entities } from "./DataPortalShared"

export default function RenderTree({ id, type, token, name, onSetQuery, onUpdateGUI, isGUIEditor, ...props }) {
  const [treeDisplay, setTree] = React.useState(null)
  const [expanded, setExpanded] = React.useState(false)

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

  return (
    <Card key={"div" + id[id.length - 1]} style={{ marginTop: "2px" }}>
      <Typography
        key={"text" + id[id.length - 1]}
        style={{
          scrollBehavior: "smooth",
          marginTop: `${5 * (id.length - 1 > 0 ? 1 : 0)}px`,
          marginLeft: `${5 * (id.length - 1)}%`,
          marginRight: "5px",
          height: "100%",
        }}
      >
        {`${name ? name : id[id.length - 1]}`}

        {isGUIEditor &&
          !Object.keys(tags_object).includes(id[id.length - 1]) &&
          Object.keys(tags_object).includes(id[id.length - 2]) && (
            <IconButton
              onClick={() =>
                onUpdateGUI({
                  _update: ["target", "type", "name", "id_string"],
                  content: [id[id.length - 1], type, name, id],
                })
              }
            >
              <Icon>subdirectory_arrow_right</Icon>
            </IconButton>
          )}

        <IconButton style={{ textAlign: "right" }} onClick={() => setExpanded(!expanded)}>
          {queryables_array.includes(id[id.length - 1]) ? (
            !isGUIEditor ? (
              <Icon>subdirectory_arrow_right</Icon>
            ) : null
          ) : expanded ? (
            <Icon>expand_less</Icon>
          ) : (
            <Icon>expand_more</Icon>
          )}
        </IconButton>
      </Typography>
      {/*
						For each branch in our tree, we output some info and create a new level
						*/}
      {expanded &&
        (!!treeDisplay ? treeDisplay : []).map((branch, index) => (
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
        ))}
    </Card>
  )
}
