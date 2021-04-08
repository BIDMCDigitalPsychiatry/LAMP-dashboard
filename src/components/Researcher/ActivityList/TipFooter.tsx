import React, { useEffect } from "react"
import {
  Grid,
  Tooltip,
  Icon,
  Fab,
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import red from "@material-ui/core/colors/red"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "&:hover": { background: "#5680f9" },
    },
  })
)

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: red[500],
    },
  },
})

export default function TipFooter({
  activities,
  isError,
  isDuplicate,
  duplicateTipText,
  validate,
  handleType,
  ...props
}) {
  const { t } = useTranslation()
  const classes = useStyles()

  useEffect(() => {
    validate()
  }, [])

  useEffect(() => {
    validate()
  }, [isError])

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-end"
      spacing={1}
      style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
    >
      {!!activities ? (
        <Grid item>
          <Tooltip title={t("Duplicate this activity.")}>
            <ThemeProvider theme={theme}>
              <Fab
                color="secondary"
                aria-label="Duplicate"
                variant="extended"
                onClick={() => {
                  if (validate()) handleType(1)
                }}
                disabled={
                  !isError || (activities && !isDuplicate) || duplicateTipText === null || duplicateTipText === ""
                }
              >
                {t("Duplicate")}
                <span style={{ width: 8 }} />
                <Icon>save</Icon>
              </Fab>
            </ThemeProvider>
          </Tooltip>
        </Grid>
      ) : (
        ""
      )}
      <Grid item>
        <Tooltip title={t("Save this activity.")}>
          <span>
            <Fab
              className={classes.btnBlue}
              aria-label="Save"
              variant="extended"
              onClick={() => {
                if (validate()) handleType(2)
              }}
              disabled={!isError}
            >
              {t("Save")}
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
