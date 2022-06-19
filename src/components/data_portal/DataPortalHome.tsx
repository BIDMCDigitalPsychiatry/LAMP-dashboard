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
  FormLabel,
  FormControl,
  Radio,
  RadioGroup,
} from "@material-ui/core"
import RenderTree from "./RenderTree"
import QueryRender from "./QueryRender"
import QueryBuilder from "./QueryBuilder"
import SelectionWindow from "./SelectionWindow"
import Editor from "./Editor"
import jsonata from "jsonata"
import { useDrop } from "react-dnd"

export enum EditorStyle {
  "AsyncGUI",
  "OnDemandGUI",
  "Terminal",
}

export default function DataPortalHome({ token, onLogout, ...props }) {
  const classes = portalHomeStyle()
  const editorRef = React.useRef(null)
  const [query, setQuery] = React.useState("")
  const [result, setResult] = React.useState("")
  const [focusBuilder, toggleFocus] = React.useState(false)

  const [treeCollapsed, setTreeCollapsed] = React.useState(false)

  const [loadingGraphs, setLoadingGraphs] = React.useState(false)

  const [currentEditorStyle, setCurrentEditorStyle] = useLocalStorage("_editor_style", EditorStyle.AsyncGUI)
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
    setViewModeSwitch(!(currentEditorStyle === EditorStyle.AsyncGUI))
  }, [currentEditorStyle === EditorStyle.AsyncGUI])

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "TARGETINFO",
    // if we drop a target in here, we switch to the GUI editor,
    // and load the new query
    drop: (item, monitor) => {
      setCurrentEditorStyle(EditorStyle.AsyncGUI)
      //@ts-ignore: item should always be an object
      setGUIQuery(item)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <Box className={classes.box}>
      <AppBar position="static" style={{ background: "#7599FF" }}>
        <Toolbar className={classes.toolbar}>
          <div style={{ flexGrow: 1 }} />
          <Typography className={classes.alphaBadge}>Alpha - V9.2021</Typography>
          {typeof onLogout === "function" && (
            <IconButton className={classes.icon} onClick={onLogout} color="inherit">
              <Typography>Log-out&nbsp;</Typography>
              <Icon className={classes.icon}>lock_outlined</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box className={classes.queryWrapperBox}>
        <Grid
          className={classes.columnsGrid}
          item
          xs={12}
          spacing={1}
          direction={"row"}
          container
          alignContent={"flex-start"}
        >
          <Grid container className={classes.treeColumn} direction={"column"} item xs={3} lg={2}>
            <FormControl>
              <FormLabel id="viewing-mode-radio-buttons-group-label">Viewing Mode</FormLabel>
              <RadioGroup
                aria-labelledby="viewing-mode-radio-buttons-group-label"
                defaultValue={EditorStyle.AsyncGUI}
                value={currentEditorStyle}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  // cast value to enum EditorStyle
                  setCurrentEditorStyle(EditorStyle[EditorStyle[(event.target as HTMLInputElement).value]])
                }}
                name="viewing-mode-radio-buttons-group"
              >
                <FormControlLabel
                  value={EditorStyle.AsyncGUI}
                  control={<Radio />}
                  label="Asynchronous GUI (Recommended)"
                />
                <FormControlLabel value={EditorStyle.OnDemandGUI} control={<Radio />} label="On Demand GUI" />
                <FormControlLabel value={EditorStyle.Terminal} control={<Radio />} label="Terminal" />
              </RadioGroup>
            </FormControl>

            <Card style={{ overflowY: "scroll", border: "1px solid black", maxHeight: "90%", marginTop: "10px" }}>
              <RenderTree
                token={token}
                name={token.name}
                id={token.type === "Administrator" ? [token.id] : [token.type, token.id]}
                type={token.type}
                isGUIEditor={currentEditorStyle === EditorStyle.AsyncGUI}
                onSetQuery={(q) => setQuery(q)}
                onUpdateGUI={(q) => updateGUIQuery(q)}
              />
            </Card>
          </Grid>
          <Grid container item direction={"column"} xs={9} lg={10} className={classes.queryColumn}>
            <Grid
              item
              ref={drop}
              role={"QueryBuilder"}
              className={focusBuilder ? classes.builderStyleFocus : classes.builderStyleUnfocus}
              onClick={() => {
                toggleFocus(true)
                if (editorRef.current) editorRef.current.editor.layout()
              }}
            >
              {(() => {
                switch (currentEditorStyle) {
                  case EditorStyle.AsyncGUI:
                    return (
                      <QueryBuilder
                        query={GUIQuery}
                        focusMe={() => toggleFocus(true)}
                        token={token}
                        setQueryResult={setResult}
                        setLoadingGraphs={setLoadingGraphs}
                        loadingGraphs={loadingGraphs}
                        queryResult={result}
                      />
                    )
                  case EditorStyle.Terminal:
                    return (
                      <Editor
                        //@ts-ignore
                        path="query"
                        automaticLayout={true}
                        ref={editorRef}
                        onChange={(x) => {
                          setQuery(x)
                          toggleFocus(true)
                          editorRef.current.editor.layout()
                        }}
                        onMount={onMonacoMount}
                      />
                    )
                  case EditorStyle.OnDemandGUI:
                    return null
                }
              })()}
            </Grid>
            <Grid
              item
              className={focusBuilder ? classes.renderStyleUnfocus : classes.renderStyleFocus}
              onClick={() => toggleFocus(false)}
            >
              <QueryRender
                className={classes.queryRender}
                focusMe={() => toggleFocus(false)}
                loading={loadingGraphs}
                queryResult={result}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {currentEditorStyle === EditorStyle.Terminal && (
        <Fab color="primary" variant="extended" className={classes.fab} onClick={runQuery}>
          <Icon className={classes.extendedIcon}>get_app</Icon>
          Run Query
        </Fab>
      )}
    </Box>
  )
}
