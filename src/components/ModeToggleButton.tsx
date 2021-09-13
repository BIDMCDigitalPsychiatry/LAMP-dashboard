import React, { useEffect } from "react"
import CheckIcon from "@material-ui/icons/Check"
import ToggleButton from "@material-ui/lab/ToggleButton"
import { makeStyles, Theme, createStyles } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    togglebtn: {
      padding: "5px 15px",
      borderRadius: "30px",
      color: "#fff !important",
      fontSize: "13px",
      textTransform: "capitalize",
    },
  })
)

export default function ModeToggleButton({ changeResearcherType, id, ...props }) {
  const [selected, setSelected] = React.useState(false)
  const classes = useStyles()

  useEffect(() => {
    const mode = localStorage.getItem("mode_" + id) !== null ? localStorage.getItem("mode_" + id) : "clinician"
    setSelected(mode === "researcher" ? true : false)
    changeResearcherType(mode)
  }, [])

  return (
    <ToggleButton
      className={classes.togglebtn}
      value="check"
      selected={selected}
      onChange={() => {
        const mode = !selected ? "researcher" : "clinician"
        changeResearcherType(mode)
        localStorage.setItem("mode_" + id, mode)
        setSelected(!selected)
      }}
    >
      {selected ? "Advanced Mode" : "Simple Mode"}
    </ToggleButton>
  )
}
