import {
  Box,
  Grid,
  Typography,
  Fab,
  makeStyles,
  Icon,
  FormGroup,
  FormControl,
  ButtonGroup,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
} from "@material-ui/core"
import React, { useRef, useState } from "react"
import LoginFrame from "./components/LoginFrame"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"

const useAccountSetupStyles = makeStyles({
  setupTypeOption: {
    backgroundColor: "#f0f0f0",
    padding: "0.5rem 2rem",
    borderRadius: "3em",
  },
  blueButton: {
    backgroundColor: "#7599FF",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#5c84f0",
      color: "#FFF",
    },
  },
})

const enum SetupSteps {
  SELECT_SETUP = "SELECT_SETUP",
  O_AUTH = "O_AUTH",
  TWO_FACTOR = "TWO_FACTOR",
}

export function LinkAccount(props) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useAccountSetupStyles()
  const [currentStep, setCurrentStep] = useState(SetupSteps.SELECT_SETUP)

  // Display error messages only once
  const errorMessageEnqueued = useRef(false)
  const searchParams = new URLSearchParams(window.location.search)
  const errorMessage = searchParams.get("error")
  if (errorMessage && !errorMessageEnqueued.current) {
    enqueueSnackbar(errorMessage, { variant: "error" })
    errorMessageEnqueued.current = true
  }

  // O-Auth providers configured for server
  const configuredProviders = LAMP.Auth._configuredProviders

  const handleLinkOauth = async (socialProvider: string) => {
    const result: any = await LAMP.Credential.linkAccount(socialProvider)
    if (!!result.redirectUrl) {
      window.location.replace(result.redirectUrl)
    }
  }

  return (
    <LoginFrame>
      {currentStep === SetupSteps.TWO_FACTOR ? (
        <TwoFactorSetup onGoBack={() => setCurrentStep(SetupSteps.SELECT_SETUP)} />
      ) : currentStep === SetupSteps.O_AUTH ? (
        <OAuthSetup onGoBack={() => setCurrentStep(SetupSteps.SELECT_SETUP)} />
      ) : (
        <React.Fragment>
          <Box marginBottom={2}>
            <Typography>
              {t("You're almost done setting up your account. Pick one of the options below to finish account setup.")}
            </Typography>
          </Box>
          <Box marginBottom={2}>
            <PickSetupOption
              text={t("Link to External Account")}
              onSelect={() => {
                setCurrentStep(SetupSteps.O_AUTH)
              }}
            />
          </Box>
          <Box marginBottom={2}>
            <PickSetupOption
              text={t("Username and Password")}
              onSelect={() => {
                setCurrentStep(SetupSteps.TWO_FACTOR)
              }}
            />
          </Box>
        </React.Fragment>
      )}
    </LoginFrame>
  )
}

function TwoFactorSetup({ onGoBack }) {
  const { t } = useTranslation()
  const classes = useAccountSetupStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [identifierType, setIdentifierType] = useState("email")
  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: "",
  })
  const handleChangeIdentifierType = (event) => {
    setIdentifierType(event.target.value)
  }

  // Form validation: applies form errors and returns true if the form is valid (false otherwise)
  const validateForm = () => {
    const newFormErrors = { ...formErrors }
    let isValid = true
    // Validate email
    if (identifierType === "email" && email.trim().length === 0) {
      newFormErrors.email = t("Enter a valid email address.")
      isValid = false
    } else {
      newFormErrors.email = ""
    }

    // Validate phone
    if (identifierType === "phone" && phone.trim().length === 0) {
      newFormErrors.phone = t("Enter a valid phone number.")
      isValid = false
    } else {
      newFormErrors.phone = ""
    }

    setFormErrors(newFormErrors)
    return isValid
  }

  const handleSubmit = async () => {
    console.log(">>> Handle submit...")
    // Validate form
    if (!validateForm()) {
      return
    }

    // Call 2FA setup endpoint
    const configResult: any = await LAMP.Credential.configureTwoFactor({
      email: identifierType === "email" ? email : undefined,
      phone: identifierType === "phone" ? phone : undefined,
    })

    if (configResult?.message === "ok") {
      // Show verify page!
    } else {
      enqueueSnackbar(t("Could not configure two factor authentication at this time."))
    }
  }

  return (
    <Box>
      <Box marginY={3}>
        <FormGroup>
          <RadioGroup name="identifier-type" value={identifierType} onChange={handleChangeIdentifierType}>
            <FormLabel component="legend">{t("Authenticate using")}: </FormLabel>
            <Grid container direction="row" justifyContent="space-evenly">
              <FormControlLabel value="email" control={<Radio />} label={t("Email")} />
              <FormControlLabel value="phone" control={<Radio />} label={t("Phone")} />
            </Grid>
          </RadioGroup>
          {identifierType === "email" && (
            <TextField
              id="identifier-email"
              name="email"
              label={t("Email")}
              variant="outlined"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              error={!!formErrors.email}
            />
          )}
          {identifierType === "phone" && (
            <TextField
              id="identifier-phone"
              name="phone"
              label={t("Phone")}
              variant="outlined"
              onChange={(event) => setPhone(event.target.value)}
              value={phone}
              error={!!formErrors.phone}
            />
          )}
          <FormControl />
        </FormGroup>
      </Box>
      <Grid container direction="row" justifyContent="space-between">
        <Fab variant="circular" type="button" onClick={onGoBack} aria-label={t("Go Back")}>
          <Icon>arrow_back</Icon>
        </Fab>
        <Fab
          variant="circular"
          type="button"
          onClick={handleSubmit}
          aria-label={t("Submit")}
          className={classes.blueButton}
        >
          <Icon>arrow_forward</Icon>
        </Fab>
      </Grid>
    </Box>
  )
}

function OAuthSetup({ onGoBack }) {
  const classes = useAccountSetupStyles()
  const { t } = useTranslation()

  const configuredProviders = LAMP.Auth._configuredProviders

  const handleLinkOauth = async (socialProvider: string) => {
    const result: any = await LAMP.Credential.linkAccount(socialProvider)
    if (!!result.redirectUrl) {
      window.location.replace(result.redirectUrl)
    }
  }
  return (
    <Box>
      <Box marginY={3}>
        <Grid direction="row" justifyContent="space-evenly">
          {configuredProviders.map((providerId) => (
            <Fab
              variant="extended"
              type="button"
              onClick={() => {
                handleLinkOauth(providerId)
              }}
              key={`link-account-${providerId}`}
              className={classes.blueButton}
            >
              {providerId}
            </Fab>
          ))}
        </Grid>
      </Box>
      <Fab variant="circular" type="button" onClick={onGoBack} aria-label={t("Go Back")}>
        <Icon>arrow_back</Icon>
      </Fab>
    </Box>
  )
}

function PickSetupOption({ onSelect, text }) {
  const classes = useAccountSetupStyles()
  return (
    <Box className={classes.setupTypeOption}>
      <Grid container direction="row" justifyContent="space-between" alignContent="center">
        <Box alignContent="center">
          <Typography>{text}</Typography>
        </Box>
        <Fab
          variant="circular"
          type="button"
          onClick={onSelect}
          className={classes.blueButton}
          style={{ fontSize: "0.5em" }}
          aria-label={`Select ${text}`}
        >
          <Icon>arrow_forward</Icon>
        </Fab>
      </Grid>
    </Box>
  )
}
