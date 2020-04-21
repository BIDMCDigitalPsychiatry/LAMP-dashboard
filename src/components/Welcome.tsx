import React, { useState, useEffect } from "react"
import { Typography, Fab, Box, Slide, Container, Icon } from "@material-ui/core"

export default function Welcome({ ...props }) {
  const [checked, setChecked] = useState(0)

  return (
    <Container maxWidth="md">
      <Slide direction="left" in={checked === 0} mountOnEnter unmountOnExit>
        <Box p={4} my={4} width="100%">
          <Typography variant="h1">Welcome to mindLAMP! </Typography>
          <Typography variant="h4">
            With the mindLAMP smartphone app, you can collect information about your health. You can learn about
            symptoms, brain health, and check your thinking. You can also learn about your steps and sleep and how they
            may relate to how you feel. You can use mindLAMP as part of a research study, part of your care if a
            clinician ask you to try it, or on your own.
          </Typography>
          <br />
          <Fab color="primary" onClick={() => setChecked(1)}>
            <Icon>arrow_forward</Icon>
          </Fab>
        </Box>
      </Slide>
      <Slide direction="left" in={checked === 1} mountOnEnter unmountOnExit>
        <Box p={4} my={4} width="100%">
          <Typography variant="h1">Activities </Typography>
          <Typography variant="h4">
            Here are all the activities you'll receive notifications for when you use mindLAMP.
          </Typography>
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
          <Typography variant="h1">Sensors </Typography>
          <Typography variant="h4">
            Here are all the sensors that will be enabled when you use mindLAMP as part of your research study.
          </Typography>
          <br />
          <Fab color="primary" onClick={() => setChecked(1)}>
            <Icon>arrow_backward</Icon>
          </Fab>
        </Box>
      </Slide>
    </Container>
  )
}
