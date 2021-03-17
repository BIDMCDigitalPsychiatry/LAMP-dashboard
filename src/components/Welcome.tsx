import React, { useState } from "react"
import { Typography, Fab, Box, Slide, Container, Icon, Card, Grid } from "@material-ui/core"
import { useTranslation } from "react-i18next"
export default function Welcome({ activities, onClose, ...props }) {
  const [checked, setChecked] = useState(0)
  const { t } = useTranslation()
  return (
    <Container maxWidth="md">
      <Slide direction="left" in={checked === 0} mountOnEnter unmountOnExit>
        <Box p={4} my={4} width="100%">
          <Typography variant="h1">{t("Welcome to mindLAMP!")} </Typography>
          <Typography variant="h4">
            {t(
              "With the mindLAMP smartphone app, you can collect information about your health. You can learn about symptoms, brain health, and check your thinking. You can also learn about your steps and sleep and how they may relate to how you feel. You can use mindLAMP as part of a research study, part of your care if a clinician ask you to try it, or on your own."
            )}
          </Typography>
          <br />
          <Fab color="primary" onClick={() => setChecked(1)}>
            <Icon>arrow_forward</Icon>
          </Fab>
        </Box>
      </Slide>
      <Slide direction="left" in={checked === 1} mountOnEnter unmountOnExit>
        <Box p={4} my={4} width="100%">
          <Typography variant="h1">{t("Activities")} </Typography>
          <Typography variant="h4">
            {t("Here are all the activities you'll receive notifications for when you use mindLAMP.")}
          </Typography>
          <br />
          <Grid container direction="row" spacing={4}>
            {activities.map((x) => (
              <Grid item xs={3}>
                <Card
                  raised={true}
                  elevation={5}
                  style={{ padding: "6px 0", height: "50px", width: "150px", margin: "auto" }}
                >
                  <Typography align="center" variant="body1" style={{ height: "100%" }}>
                    {x.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          <br />
          <Fab color="primary" onClick={() => setChecked(0)}>
            <Icon>arrow_backward</Icon>
          </Fab>
          <Fab color="primary" onClick={() => setChecked(2)}>
            <Icon>arrow_forward</Icon>
          </Fab>
        </Box>
      </Slide>
      <Slide direction="left" in={checked === 2} mountOnEnter unmountOnExit>
        <Box p={4} my={4} width="100%">
          <Typography variant="h1">{t("Let's go!")} </Typography>
          <Typography variant="h4">{t("You're ready to start using mindLAMP.")}</Typography>
          <br />
          <Fab color="primary" onClick={() => setChecked(1)}>
            <Icon>arrow_backward</Icon>
          </Fab>
          <Fab color="primary" onClick={onClose}>
            <Icon>done</Icon>
          </Fab>
        </Box>
      </Slide>
    </Container>
  )
}
