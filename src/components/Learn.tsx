// Core Imports
import React from "react"
import { Container, Typography, Grid, Card, Box } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import  { Participant as ParticipantObj } from "lamp-core"
import { ReactComponent as Book } from "../icons/Book.svg"
import { ReactComponent as MoodTips } from "../icons/MoodTips.svg"
import { ReactComponent as SleepTips } from "../icons/SleepTips.svg"
import { ReactComponent as Chat } from "../icons/Chat.svg"
import { ReactComponent as Wellness } from "../icons/Wellness.svg"
import { ReactComponent as PaperLens } from "../icons/PaperLens.svg"
import { ReactComponent as Info } from "../icons/Info.svg"
import { ReactComponent as Lightning } from "../icons/Lightning.svg"

import Link from "@material-ui/core/Link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 16,

      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
    },
    learn: {
      background: "#FFF9E5",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
    },
  })
)

export default function Manage({ participant, ...props }: { participant: ParticipantObj }) {
  const classes = useStyles()

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Mood`} underline="none">
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <MoodTips />
              </Box>
              <Typography className={classes.cardlabel}>Mood Tips</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Sleep`} underline="none">
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <SleepTips />
              </Box>
              <Typography className={classes.cardlabel}>Sleep Tips</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Social`} underline="none">
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <Chat />
              </Box>
              <Typography className={classes.cardlabel}>Social Tips</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Resources`} underline="none">
            <Card className={classes.learn}>
              <Box mt={1}>
                <Info />
              </Box>
              <Typography className={classes.cardlabel}>Mental Health Resources</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Physical_WellNess`} underline="none">
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <Wellness />
              </Box>
              <Typography className={classes.cardlabel}>Physical Wellness</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Books`} underline="none">
            <Card className={classes.learn}>
              <Box mt={1}>
                <Book />
              </Box>
              <Typography className={classes.cardlabel}>Suggested Reading</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Motivation`} underline="none">
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <PaperLens />
              </Box>
              <Typography className={classes.cardlabel}>Motivation</Typography>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/me/LearnTips/Stress`} underline="none">
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <Lightning />
              </Box>
              <Typography className={classes.cardlabel}>Stress Tips</Typography>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Container>
  )
}
