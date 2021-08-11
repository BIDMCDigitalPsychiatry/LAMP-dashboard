import React from "react"
import { Typography, Button, Icon, TextField, Container, Avatar, makeStyles } from "@material-ui/core"
import { ajaxRequest } from "./DataPortalShared"

const useStyles = makeStyles((theme) => ({
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

export default function SignIn({ onSubmit, ...props }) {
  const classes = useStyles()
  const [isLoading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    let data = Object.values(e.target)
      //@ts-ignore: {} is an object. Therefore, I can create a spread from it.
      .reduce((x, { name, value }) => ({ ...x, [name]: value }), {})

    //Default server is api.lamp.digital
    if (data["server"] === "") data["server"] = "api.lamp.digital"
    function setUser(result) {
      let parentCount = Object.keys(JSON.parse(result)["data"]).length
      switch (parentCount) {
        case 0:
          const readyUser = (result) => {
            let json = JSON.parse(result)["data"]
            let userInfo = {
              type: "Researcher",
              name: json[0].name,
              id: json[0].id,
            }
            onSubmit(Object.assign(data, userInfo))
          }
          let sending = {
            method: "GET",
            //@ts-ignore: This property will be created by the form (see line 37)
            url: `https://${data.server}/researcher/me`,
            //@ts-ignore: This property will be created by the form (see line 37)
            headers: [["Authorization", `Basic ${data.username}:${data.password}`]],
            callback: readyUser,
          }
          ajaxRequest(sending)
          break
        case 1:
          setError(`These credentials are valid but don't currently have data portal access.
								 Please check again later`)
          break
        case 2:
          setError(`These credentials are valid but don't currently have data portal access.
								 Please check again later`)
          break
      }
      setLoading(false)
    }

    function testAdmin(result) {
      let res = JSON.parse(result)
      if ("error" in res && !res["error"].startsWith("400.")) {
        setError(`An error occurred. Please check your credentials and try again.`)
      } else {
        let userInfo = {
          type: "Administrator",
          name: "Administrator",
          id: "Administrator",
        }
        onSubmit(Object.assign(data, userInfo))
      }
      setLoading(false)
    }

    //admin test
    let sending = {
      method: "GET",
      //@ts-ignore: This property will be created by the form (see line 37)
      url: `https://${data.server}/type/me/parent`,
      //@ts-ignore: This property will be created by the form (see line 37)
      headers: [["Authorization", `Basic ${data.username}:${data.password}`]],
      callback: setUser,
      alternateCallback: testAdmin,
    }

    //We need to figure out whether this is a
    //researcher, administrator, or participant
    //which we do with our first request
    ajaxRequest(sending)
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <Icon>lock_outlined</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="server"
            label="Server Address"
            type="url"
            id="server-address"
            autoComplete="server"
            placeholder="api.lamp.digital"
            helperText={"Don't enter a domain if you're not sure what this option does."}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            className={classes.submit}
          >
            {isLoading ? `Loading...` : `Sign In`}
          </Button>
          {error.length > 0 && <Typography style={{ color: "red" }}>{error}</Typography>}
        </form>
      </div>
    </Container>
  )
}
