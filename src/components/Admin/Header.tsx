import React, { useState, useEffect } from "react"
import { Box, Typography, makeStyles, Theme, createStyles } from "@material-ui/core"
import SearchBox from "../SearchBox"
import { useTranslation } from "react-i18next"
import AddUpdateResearcher from "./AddUpdateResearcher"
import { Service } from "../DBService/DBService"
import useInterval from "../useInterval"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      position: "relative",
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
  })
)
export default function Header({ researchers, searchData, refreshResearchers, userType, ...props }) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [studies, setStudies] = useState(null)

  useInterval(
    () => {
      getDBStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  const getDBStudies = async () => {
    if (userType === "user_admin") {
      Service.getAll("studies").then((studies) => {
        setStudies(studies)
      })
    }
  }

  return (
    <Box display="flex" alignItems="center" className={classes.header}>
      <Box flexGrow={1}>
        <Typography variant="h5">
          {userType === "user_admin" || userType === "clinical_admin" ? t("Clinicians") : t("Researchers")}
        </Typography>
      </Box>
      <SearchBox searchData={searchData} />
      {userType !== "clinical_admin" && (
        <AddUpdateResearcher
          refreshResearchers={refreshResearchers}
          researchers={researchers}
          authuserType={userType}
          studies={studies}
        />
      )}
    </Box>
  )
}
