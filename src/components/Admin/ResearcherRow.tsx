import React, { useState } from "react"
import { Box, Fab, Card, CardHeader, CardActions, Icon } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Credentials from "../Credentials"
import DeleteResearcher from "./DeleteResearcher"
import AddUpdateResearcher from "./AddUpdateResearcher"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    activityHeader: { padding: "20px 5px 20px 15px" },
    cardMain: {
      boxShadow: "none !important ",
      background: "#F8F8F8",
      "& span.MuiCardHeader-title": { fontSize: "16px", fontWeight: 500 },
    },
    checkboxActive: { color: "#7599FF !important" },
    btnWhite: {
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
    buttoncontainer: {
      "& button": {
        marginLeft: "8px",
      },
    },
  })
)

export default function ResearcherRow({
  history,
  researcher,
  researchers,
  refreshResearchers,
  updateStore,
  adminType,
  ...props
}) {
  const classes = useStyles()
  const [name, setName] = useState(researcher.name)

  return (
    <Card className={classes.cardMain}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} py={1}>
          <CardHeader className={classes.activityHeader} title={name} />
        </Box>
        <Box>
          <CardActions>
            {adminType !== "practice_lead" && (
              <Box display="flex" flexDirection="row" className={classes.buttoncontainer}>
                <Credentials user={researcher} />
                <AddUpdateResearcher
                  researcher={researcher}
                  refreshResearchers={refreshResearchers}
                  setName={setName}
                  researchers={researchers}
                  updateStore={updateStore}
                />
                <DeleteResearcher researcher={researcher} refreshResearchers={refreshResearchers} />
              </Box>
            )}
            {adminType !== "user_admin" && (
              <Fab
                size="small"
                classes={{ root: classes.btnWhite }}
                onClick={() => {
                  history.push(`/researcher/${researcher.id}/users`)
                }}
              >
                <Icon>arrow_forward</Icon>
              </Fab>
            )}
          </CardActions>
        </Box>
      </Box>
    </Card>
  )
}
