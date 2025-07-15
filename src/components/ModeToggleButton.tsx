import React, { useEffect } from "react"
import ToggleButton from "@material-ui/lab/ToggleButton"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    togglebtn: {
      padding: "5px 15px",
      borderRadius: "30px",
      color: "#7599FF !important",
      fontSize: "13px",
      textTransform: "capitalize",
      background: "#fff !important",
      fontWeight: 600,
    },
  })
)

export default function ModeToggleButton({ changeResearcherType, ...props }) {
  const [selected, setSelected] = React.useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  useEffect(() => {
    const mode = localStorage.getItem("mode") !== null ? localStorage.getItem("mode") : "clinician"
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
        localStorage.setItem("mode", mode)
        setSelected(!selected)
      }}
    >
      {selected ? t("Advanced Mode") : t("Simple Mode")}
    </ToggleButton>
  )
}
