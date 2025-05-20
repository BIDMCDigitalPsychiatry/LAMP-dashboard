import React, { useEffect, useState } from "react"
import {
  Box,
  Popover,
  Fab,
  Typography,
  Icon,
  MenuItem,
  makeStyles,
  Theme,
  createStyles,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import PatientStudyCreator from "../ParticipantList/PatientStudyCreator"
import SearchBox from "../../SearchBox"
import Switch, { SwitchProps } from "@mui/material/Switch"
import { styled } from "@mui/material/styles"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
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
      },
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      marginTop: 75,
      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "15px 30px",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
    popexpand: {
      backgroundColor: "#fff",
      color: "#618EF7",
      zIndex: 11111,
      "& path": { fill: "#618EF7" },
      "&:hover": { backgroundColor: "#f3f3f3" },
    },
    addText: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    // toggleSwitch: {
    //   "& .MuiSwitch-track": {
    //     backgroundColor: "#7599FF !important",
    //   },
    // },
  })
)

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#1976d2",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}))

export default function Header({ studies, researcherId, searchData, setParticipants, setEnabled, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [enabled, setCEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [initial, setInitial] = useState(true)

  useEffect(() => {
    LAMP.Type.getAttachment(researcherId, "lamp.dashboard.conversation_enabled").then((result: any) => {
      setCEnabled(result.data)
      setInitial(false)
    })
  }, [])

  useEffect(() => {
    if (!!enabled && !initial) {
      setOpen(true)
    }
    if (!initial) {
      setEnabled(enabled)
      LAMP.Type.setAttachment(researcherId, "me", "lamp.dashboard.conversation_enabled", enabled)
    }
  }, [enabled])

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1} display="flex">
          <Typography variant="h5">{`${t("Conversations")}`}</Typography>
          <Box pl={2}>
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  checked={enabled}
                  onChange={(e) => {
                    setInitial(false)
                    setCEnabled(e.target.checked)
                  }}
                />
              }
              label={enabled ? "Enabled" : "Disabled"}
            />
          </Box>
        </Box>
        <Dialog
          open={!!open}
          onClose={() => {
            setOpen(false)
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`${t(
                "mindLAMP does not monitor messages. All communication is your responsibility. Do not share or solicit Personal Health Information (PHI) through this system."
              )}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              {`${t("Ok")}`}
            </Button>
          </DialogActions>
        </Dialog>
        <Box>
          <SearchBox searchData={searchData} />
        </Box>
      </Box>
    </Box>
  )
}
