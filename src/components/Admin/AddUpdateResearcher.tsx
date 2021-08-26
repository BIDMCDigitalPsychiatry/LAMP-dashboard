import React, { useState, useEffect } from "react"
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
  MenuItem,
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
  authuserType,
  researcher,
  researchers,
  refreshResearchers,
  setName,
  updateStore,
  setType,
  studies,
  ...props
}: {
  authuserType?: string
  researcher?: any
  researchers?: any
  refreshResearchers?: Function
  setName?: Function
  updateStore?: Function
  setType?: Function
  studies?: any
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setResearcherName] = useState(!!researcher ? researcher.name : "")
  const [rData, setRdara] = useState(researcher)
  const [userType, setUserType] = useState(!!researcher ? researcher.res : "researcher")
  const [studyId, setStudyId] = useState(!!researcher ? researcher.study : "")

  useEffect(() => {
    let type = authuserType !== "admin" ? "clinician" : "researcher"
    type = !!researcher ? researcher.res : type
    setUserType(type)
  }, [])

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
      let result = !!researcher
        ? ((await LAMP.Researcher.update(researcher.id, researcherObj)) as any)
        : ((await LAMP.Researcher.create(researcherObj)) as any)
      if (result?.error !== undefined) {
        enqueueSnackbar(t("Failed to create a new researcher."), {
          variant: "error",
        })
        setOpen(false)
      } else {
        await LAMP.Type.setAttachment(!!researcher ? researcher.id : result.data, "me", "lamp.dashboard.user_type", {
          userType: userType,
          studyId: userType === "clinician" ? studyId : "",
          studyName: userType === "clinician" ? studies.filter((study) => study.id === studyId)[0]?.name : "",
        })
        enqueueSnackbar(
          !!researcher
            ? t("Successfully updated  the " + userType.replace("/_/g", " "))
            : t("Successfully created a new " + userType.replace("/_/g", " ")),
          {
            variant: "success",
          }
        )
        if (!!researcher) {
          updateStore(researcher.id)
          setName(name.trim())
          setType(userType)
          setRdara({ ...rData, name: name.trim(), userType: userType })
        } else {
          setResearcherName("")
          refreshResearchers()
        }
        setOpen(false)
      }
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
          {authuserType === "admin" && (
            <TextField
              select
              autoFocus
              fullWidth
              label={t("User type")}
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value)
              }}
              inputProps={{ maxLength: 80 }}
            >
              <MenuItem key="user_admin" value="user_admin">
                User Administrator
              </MenuItem>
              <MenuItem key="clinical_admin" value="clinical_admin">
                Clinical Administrator
              </MenuItem>
              <MenuItem key="researcher" value="researcher">
                Researcher
              </MenuItem>
            </TextField>
          )}
          {authuserType !== "admin" && (
            <TextField
              select
              autoFocus
              fullWidth
              variant="outlined"
              label={t("Study")}
              value={studyId}
              onChange={(e) => {
                setStudyId(e.target.value)
              }}
            >
              {(studies || []).map((study) => (
                <MenuItem key={study.id} value={study.id}>
                  {study.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={t(authuserType !== "admin" ? "Clinician" : "Name")}
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
