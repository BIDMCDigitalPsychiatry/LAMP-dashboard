import React, { useState } from "react"
import {
  Box,
  DialogContent,
  makeStyles,
  Theme,
  createStyles,
  Fab,
  Icon,
  Dialog,
  DialogActions,
  TextField,
  Button,
} from "@material-ui/core"
import SearchBox from "../SearchBox"
import LAMP, { Researcher } from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
    },
    optionsMain: {
      background: "#ECF4FF",
      borderTop: "1px solid #C7C7C7",
      marginTop: 20,
      width: "99.4vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    },
    optionsSub: { width: 1030, maxWidth: "80%", margin: "0 auto", padding: "10px 0" },
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
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.up("md")]: {
        position: "absolute",
        top: 0,
      },
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },
  })
)
export default function AddUpdateResearcher({
  researcher,
  researchers,
  refreshResearchers,
  setName,
  updateStore,
  ...props
}: {
  researcher?: any
  researchers?: any
  refreshResearchers?: Function
  setName?: Function
  updateStore?: Function
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setResearcherName] = useState(!!researcher ? researcher.name : "")
  const [rData, setRdara] = useState(researcher)

  const addResearcher = async () => {
    let duplicates = researchers.filter((x) =>
      !!researcher
        ? x.name?.toLowerCase() === name?.trim().toLowerCase() && x.id !== researcher?.id
        : x.name?.toLowerCase() === name?.trim().toLowerCase()
    )
    if (duplicates.length > 0) {
      enqueueSnackbar("Researcher with same name already exist.", { variant: "error" })
      setResearcherName(!!researcher ? researcher.name : "")
    } else {
      const researcherObj = new Researcher()
      researcherObj.name = name.trim()
      if (
        !!researcher
          ? ((await LAMP.Researcher.update(researcher.id, researcherObj)) as any).error === undefined
          : ((await LAMP.Researcher.create(researcherObj)) as any).error === undefined
      ) {
        if (!!researcher) {
          updateStore(researcher.id)
          setName(name.trim())
          setRdara({ ...rData, name: name.trim() })
        } else {
          setResearcherName("")
          refreshResearchers()
        }
        enqueueSnackbar(
          !!researcher ? t("Successfully updated a new researcher.") : t("Successfully created a new researcher."),
          {
            variant: "success",
          }
        )
        setOpen(false)
      } else
        enqueueSnackbar(t("Failed to create a new researcher."), {
          variant: "error",
        })
    }
  }

  return (
    <Box display="flex" alignItems="start">
      {!!researcher ? (
        <Fab size="small" classes={{ root: classes.btnWhite }} onClick={() => setOpen(true)}>
          <Icon>edit</Icon>
        </Fab>
      ) : (
        <Fab variant="extended" classes={{ root: classes.btnBlue }} onClick={() => setOpen(true)}>
          <Icon>add</Icon> {t("Add")}
        </Fab>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={t("Name")}
            fullWidth
            onChange={(event) => setResearcherName(event.target.value)}
            value={name}
            helperText={typeof name == "undefined" || name === null || name.trim() === "" ? t("Please enter name") : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false)
              setResearcherName(!!rData ? rData.name : "")
            }}
            color="primary"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => addResearcher()}
            color="primary"
            disabled={typeof name == "undefined" || name === null || name.trim() === "" ? true : false}
          >
            {!!researcher ? t("Update") : t("Add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
