import React, { useState } from "react"
import { Box, Typography, makeStyles, Theme, createStyles, Icon, Link } from "@material-ui/core"
import StudyFilter from "../ParticipantList/StudyFilter"
import DeleteParticipant from "./DeleteParticipant"
import AddButton from "./AddButton"
import StudyFilterList from "../ParticipantList/StudyFilterList"
import { useTranslation } from "react-i18next"
import SearchBox from "../../SearchBox"
import ToggleFeed from "./ToggeFeed"

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
    settingslink: {
      background: "#fff",
      width: 40,
      height: 40,
      borderRadius: "50%",
      padding: 8,
      color: "#7599FF",
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function Header({
  studies,
  researcherId,
  selectedParticipants,
  searchData,
  setSelectedStudies,
  selectedStudies,
  setParticipants,
  setData,
  mode,
  order,
  setOrder,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [showFilterStudies, setShowFilterStudies] = useState(false)

  const handleShowFilterStudies = (status) => {
    setShowFilterStudies(status)
  }

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">{`${t("Users")}`}</Typography>
        </Box>

        <Box>
          <StudyFilter setShowFilterStudies={handleShowFilterStudies} setOrder={setOrder} order={order} />
        </Box>
        <SearchBox searchData={searchData} />
        <Box>
          <Link href={`/#/researcher/${researcherId}/settings`} underline="none" className={classes.settingslink}>
            <Icon>settings</Icon>
          </Link>
        </Box>
        <Box>
          <AddButton
            researcherId={researcherId}
            studies={studies}
            setParticipants={setParticipants}
            setSelectedStudies={setSelectedStudies}
            setData={setData}
            mode={mode}
          />
        </Box>
      </Box>
      {!!showFilterStudies && (
        <Box>
          <StudyFilterList
            studies={studies}
            researcherId={researcherId}
            type="participants"
            showFilterStudies={showFilterStudies}
            selectedStudies={selectedStudies}
            setSelectedStudies={setSelectedStudies}
          />
        </Box>
      )}
      {(selectedParticipants || []).length > 0 && (
        <Box className={classes.optionsMain}>
          <Box
            className={classes.optionsSub}
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <ToggleFeed participants={selectedParticipants} setParticipants={setParticipants} />
            <DeleteParticipant participants={selectedParticipants} setParticipants={setParticipants} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
