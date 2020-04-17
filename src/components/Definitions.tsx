// Core Imports
import React from "react"
import {
  Typography,
  makeStyles,
  Box,
  Link,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  root2: {
    maxWidth: 345,
    minWidth: 344,
    margin: "16px",
    maxLength: 500,
  },
  media: {
    height: 300,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

export default function Resources({ ...props }) {
  const classes = useStyles()
  return (
    <Grid container direction="row">
      <Box p={4} my={4} width="100%">
        <Grid container direction="row" alignItems="stretch">
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://three-principles.com/wp-content/uploads/2018/03/thoughts.png"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  CBT vs DBT
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Cognitive-behavioral therapy (CBT) is one of the most commonly practiced forms of psychotherapy today.
                  It’s focus is on helping people learn how their thoughts color and can actually change their feelings
                  and behaviors. It is usually time-limited and goal-focused as practiced by most psychotherapists in
                  the U.S. today. Dialectical behavior therapy (DBT) is a specific form of cognitive-behavioral therapy.
                  DBT seeks to build upon the foundation of CBT, to help enhance its effectiveness and address specific
                  concerns that the founder of DBT, psychologist Marsha Linehan, saw as deficits in CBT.
                </Typography>
                <Link href="https://psychcentral.com/lib/whats-the-difference-between-cbt-and-dbt/">
                  More information
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://static.energyresourcing.com/wp-content/uploads/2020/03/26170014/mental-health-wellness-during-covid-19.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Psychologist vs Psychiatrist
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Psychiatrists have a medical degree along with advanced qualifications from residency and a specialty
                  in psychiatry. They use talk therapy, medications, and other treatments to treat people with mental
                  health conditions. Psychologists have an advanced degree, such as a PhD or PsyD. Most commonly, they
                  use talk therapy to treat mental health conditions. They may also act as consultants along with other
                  healthcare providers or study therapy for entire treatment programs. Both types of providers must be
                  licensed in their area to practice. Psychiatrists are also licensed as medical doctors.
                </Typography>
                <Link href="https://www.healthline.com/health/mental-health/what-is-the-difference-between-a-psychologist-and-a-psychiatrist#practice">
                  More information
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Grid>
  )
}
