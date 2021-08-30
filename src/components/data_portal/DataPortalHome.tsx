import React, { useRef } from "react"
import { portalHomeStyle, useLocalStorage } from "./DataPortalShared"
import {
  Typography,
  Icon,
  IconButton,
  AppBar,
  Toolbar,
  Grid,
  Switch,
  Box,
  Fab,
  Card,
  FormControlLabel,
} from "@material-ui/core"
import RenderTree from "./RenderTree"
import QueryRender from "./QueryRender"
import QueryBuilder from "./QueryBuilder"
import SelectionWindow from "./SelectionWindow"
import Editor from "./Editor"
import jsonata from "jsonata"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function DataPortalHome({ token, onLogout, ...props }) {
  const classes = portalHomeStyle()
  const editorRef = React.useRef(null)
  const [query, setQuery] = React.useState("")
  const [result, setResult] = React.useState("")

  const [loadingGraphs, setLoadingGraphs] = React.useState(false)

  const [isGUIEditor, toggleEditorStyle] = useLocalStorage("_editor_style", true)
  const [GUIQuery, setGUIQuery] = React.useState({
    target: "",
    name: "",
    query: "",
    type: "",
  })
  const runQuery = async () => {
    try {
      jsonata(query)["errors"] // check for errors first (change from .errors() made for TSX compliance)
      let res = await fetch(`https://${token.server}`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${token.username}:${token.password}`,
        },
        body: query,
      })
      let text = await res.text()
      let json = JSON.parse(text)
      setResult(!!json["$schema"] ? json : text)
    } catch (err) {
      delete err.stack
      setResult(JSON.stringify(err, null, 4))
    }
  }

  const onMonacoMount = (ref) => {
    editorRef.current = ref
    if (!!editorRef.current) editorRef.current.editor.getModel().setValue(query)
  }
  React.useEffect(() => {
    if (!!editorRef.current) {
      let cursorY = editorRef.current.editor.getPosition().lineNumber
      let cursorX = editorRef.current.editor.getPosition().column
      editorRef.current.editor.getModel().setValue(query)
      editorRef.current.editor.setPosition({ lineNumber: cursorY, column: cursorX })
    }
  }, [query])

  function updateGUIQuery(change) {
    let updatedQuery = { ...GUIQuery }
    change._update.forEach(function (updateTarget, index) {
      updatedQuery[updateTarget] = change.content[index]
    })
    setGUIQuery(updatedQuery)
  }

  const [viewModeSwitch, setViewModeSwitch] = React.useState(false)
  React.useEffect(() => {
    setViewModeSwitch(!isGUIEditor)
  }, [isGUIEditor])

  return (
    <Box className={classes.box}>
      <AppBar position="static" style={{ background: "#7599FF" }}>
        <Toolbar>
          <div style={{ flexGrow: 1 }} />
          <Typography className={classes.alphaBadge}>Alpha - V8.11.2021</Typography>
          {typeof onLogout === "function" && (
            <IconButton onClick={onLogout} color="inherit">
              <Typography>Log-out&nbsp;</Typography>
              <Icon className={classes.icon}>lock_outlined</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <DndProvider backend={HTML5Backend}>
        <Box className={classes.queryWrapperBox}>
          <Grid className={classes.columnsGrid} item xs={12} direction={"row"} container alignContent={"flex-start"}>
            <Grid container className={classes.treeColumn} direction={"column"} item xs={3}>
              <SelectionWindow
                openButtonText={`Change Viewing Mode (Currently ${isGUIEditor ? "GUI" : "Terminal"})`}
                displaySubmitButton={true}
                handleResult={() => {
                  toggleEditorStyle(!viewModeSwitch)
                }}
                closesOnSubmit={true}
                submitText={`Set Viewing Mode to ${!viewModeSwitch ? "GUI" : "Terminal"}`}
                children={
                  <React.Fragment>
                    <FormControlLabel
                      control={
                        <Switch
                          name={"setToTerminal"}
                          checked={viewModeSwitch}
                          onChange={() => setViewModeSwitch(!viewModeSwitch)}
                        />
                      }
                      label={viewModeSwitch ? "Terminal Mode" : "GUI Mode"}
                    />
                    {viewModeSwitch ? (
                      <Typography>
                        While in Terminal mode, you can directly write JSONata style queries to pull data directly from
                        your database. <br />
                        <br />
                        For example, try: `LAMP.ActivityEvent.list(<b>participant_id</b>)`, replacing `participant_id`
                        with a user's id to get a list of the last 10,000 activities completed through LAMP.
                        <br />
                        <br />
                        Want to learn more about JSONata queries or what special data you can pull from LAMP?
                        <a target={"_blank"} href={"https://docs.lamp.digital/data_science/jsonata"}>
                          Click here!
                        </a>
                      </Typography>
                    ) : (
                      <Typography>
                        While in GUI mode, you can directly pull graphs you have already generated from the LAMP
                        database, easily view information across an entire study or researcher, or quickly view tags
                        that give info about things like survey scoring. If this is your first time using the LAMP
                        data_portal, or you need to get data quckly, this is the mode we recommend!
                      </Typography>
                    )}
                  </React.Fragment>
                }
              />
              <Card style={{ overflowY: "scroll", border: "1px solid black", maxHeight: "70vh", marginTop: "10px" }}>
                <RenderTree
                  token={token}
                  name={token.name}
                  id={token.type === "Administrator" ? [token.id] : [token.type, token.id]}
                  type={token.type}
                  isGUIEditor={isGUIEditor}
                  onSetQuery={(q) => setQuery(q)}
                  onUpdateGUI={(q) => updateGUIQuery(q)}
                />
              </Card>
            </Grid>
            <Grid
              container
              item
              direction={"column"}
              xs={9}
              style={{ height: "100%", userSelect: "text", flexWrap: "nowrap" }}
            >
              <Grid
                item
                style={{
                  flexGrow: 1,
                  minHeight: "20%",
                  maxHeight: "40%",
                  margin: " 0 5%",
                  top: "10%",
                  overflowY: "scroll",
                }}
              >
                {isGUIEditor ? (
                  <QueryBuilder
                    query={GUIQuery}
                    token={token}
                    setQueryResult={setResult}
                    setLoadingGraphs={setLoadingGraphs}
                    queryResult={result}
                  />
                ) : (
                  <Card>
                    <Editor
                      //@ts-ignore
                      path="query"
                      ref={editorRef}
                      onChange={(x) => setQuery(x)}
                      onMount={onMonacoMount}
                    />
                  </Card>
                )}
              </Grid>
              <Grid
                item
                style={{
                  flexGrow: 2,
                  minHeight: "50%",
                  maxHeight: "80%",
                  overflowY: "scroll",
                  margin: " 10% 5% 5%",
                  background: "white",
                }}
              >
                <QueryRender loading={loadingGraphs} queryResult={result} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DndProvider>
      {!isGUIEditor && (
        <Fab color="primary" variant="extended" className={classes.fab} onClick={runQuery}>
          <Icon className={classes.extendedIcon}>get_app</Icon>
          Run Query
        </Fab>
      )}
    </Box>
  )
}
