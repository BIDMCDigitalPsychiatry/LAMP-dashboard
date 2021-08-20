import React from "react"
import { useStyles3, useLocalStorage } from "./DataPortalShared"
import { Typography, Icon, IconButton, AppBar, Toolbar, Grid, Switch, Box, Fab } from "@material-ui/core"
import RenderTree from "./RenderTree"
import QueryRender from "./QueryRender"
import QueryBuilder from "./QueryBuilder"
import Editor from "./Editor"
import jsonata from "jsonata"

export default function DataPortalHome({ token, onLogout, ...props }) {
  const classes = useStyles3()
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

  return (
    <div style={{ background: "lightgrey", display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" style={{ background: "black" }}>
        <Toolbar>
          <Icon className={classes.icon}>code</Icon>
          <Typography variant="h6" color="inherit" noWrap>
            LAMP Platform API Query
          </Typography>
          <div style={{ flexGrow: 0.2 }} />

          <div style={{ flexGrow: 0.5, width: "50px", overflowY: "scroll" }}>
            <Typography>Query Builder</Typography>
          </div>
          <div style={{ flexGrow: 0.5, width: "50px" }}>
            <Switch checked={isGUIEditor} color="primary" onClick={() => toggleEditorStyle(!isGUIEditor)} />
            <Typography>{isGUIEditor ? "User Interface" : "Terminal"}</Typography>
          </div>
          <div style={{ flexGrow: 1 }} />
          <Typography style={{ color: "red" }}>Alpha - V8.11.2021</Typography>
          {typeof onLogout === "function" && (
            <IconButton onClick={onLogout} color="inherit">
              <Typography>Log-out&nbsp;</Typography>
              <Icon className={classes.icon}>lock_outlined</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box flexWrap="nowrap" style={{ flexGrow: 1, height: "90%", marginTop: 8 }}>
        <Grid container alignContent={"flex-start"} style={{ height: "100%", flexWrap: "nowrap" }}>
          <Grid container item xs={3} style={{ height: "90%", overflowY: "scroll", background: "lightgray" }}>
            <Grid style={{ marginBottom: "30px" }} item xs={12}>
              <RenderTree
                token={token}
                name={token.name}
                id={token.type === "Administrator" ? [token.id] : [token.type, token.id]}
                type={token.type}
                isGUIEditor={isGUIEditor}
                onSetQuery={(q) => setQuery(q)}
                onUpdateGUI={(q) => updateGUIQuery(q)}
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction={"column"}
            xs={9}
            style={{ height: "100%", flexWrap: "nowrap", background: "lightgray" }}
          >
            <Grid
              item
              style={{
                minHeight: "10%",
                maxHeight: "40%",
                margin: "0px 0px 10px 0px",
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
                <Editor
                  //@ts-ignore
                  path="query"
                  ref={editorRef}
                  onChange={(x) => setQuery(x)}
                  onMount={onMonacoMount}
                />
              )}
            </Grid>
            <Grid
              item
              style={{
                flexGrow: 1,
                minHeight: "50%",
                maxHeight: "80%",
                overflowY: "scroll",
                margin: " 0 5%",
                background: "white",
              }}
            >
              <QueryRender loading={loadingGraphs} queryResult={result} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {!isGUIEditor && (
        <Fab color="primary" variant="extended" className={classes.fab} onClick={runQuery}>
          <Icon className={classes.extendedIcon}>get_app</Icon>
          Run Query
        </Fab>
      )}
    </div>
  )
}
