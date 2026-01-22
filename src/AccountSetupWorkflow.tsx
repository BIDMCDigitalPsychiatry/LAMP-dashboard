import {
  Box,
  Grid,
  Typography,
  Fab,
  makeStyles,
  Icon,
  FormGroup,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
  FormHelperText,
} from "@material-ui/core"
import React, { useRef, useState } from "react"
import LoginFrame from "./components/LoginFrame"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useAuthContext } from "./components/AuthProvider"

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
  OAUTH = "OAUTH",
  TWO_FACTOR = "TWO_FACTOR",
  TWO_FACTOR_VERIFY = "TWO_FACTOR_VERIFY",
}

export function AccountSetupWorkflow(props) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useAccountSetupStyles()

  // O-Auth providers configured for server
  const configuredProviders = LAMP.Auth._configuredProviders
  const { accountSetupState } = useAuthContext()
  const [currentStep, setCurrentStep] = useState(SetupSteps.SELECT_SETUP)

  // Display error messages only once
  const errorMessageEnqueued = useRef(false)
  const searchParams = new URLSearchParams(window.location.search)
  const errorMessage = searchParams.get("error")
  if (errorMessage && !errorMessageEnqueued.current) {
    enqueueSnackbar(errorMessage, { variant: "error" })
    errorMessageEnqueued.current = true
  }

  const setupStepComponents = {
    [SetupSteps.SELECT_SETUP]: SelectMethod,
    [SetupSteps.OAUTH]: OAuthSetup,
    [SetupSteps.TWO_FACTOR]: TwoFactorSetup,
    [SetupSteps.TWO_FACTOR_VERIFY]: TwoFactorVerify,
  }
  const CurrentComponent = setupStepComponents[currentStep]
  return (
    <LoginFrame>
      <CurrentComponent setCurrentStep={setCurrentStep}></CurrentComponent>
    </LoginFrame>
  )
}

function SelectMethod({ setCurrentStep }) {
  const { t } = useTranslation()

  return (
    <Box>
      <Box marginBottom={2}>
        <Typography>
          {t("You're almost done setting up your account. Pick one of the options below to finish account setup.")}
        </Typography>
      </Box>
      <Box marginBottom={2}>
        <PickSetupOption
          text={t("Link to External Account")}
          onSelect={() => {
            setCurrentStep(SetupSteps.OAUTH)
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
    </Box>
  )
}

function TwoFactorSetup({ setCurrentStep }) {
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
      setCurrentStep(SetupSteps.TWO_FACTOR_VERIFY)
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
        <Fab
          variant="circular"
          type="button"
          onClick={() => setCurrentStep(SetupSteps.SELECT_SETUP)}
          aria-label={t("Go Back")}
        >
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

function OAuthSetup({ setCurrentStep }) {
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
      <Fab
        variant="circular"
        type="button"
        onClick={() => setCurrentStep(SetupSteps.SELECT_SETUP)}
        aria-label={t("Go Back")}
      >
        <Icon>arrow_back</Icon>
      </Fab>
    </Box>
  )
}

function TwoFactorVerify({ setCurrentStep }) {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Box>
      <TwoFactorVerifyForm
        onSuccess={() => {
          setCurrentStep
        }}
        onError={() => {
          enqueueSnackbar(t("Failed to verify code"), { variant: "error" })
        }}
      />
      <Fab
        variant="circular"
        type="button"
        onClick={() => setCurrentStep(SetupSteps.TWO_FACTOR)}
        aria-label={t("Go Back")}
      >
        <Icon>arrow_back</Icon>
      </Fab>
    </Box>
  )
}

export function TwoFactorVerifyForm({ onSuccess = undefined, onError = undefined }) {
  const { t } = useTranslation()
  const classes = useAccountSetupStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [code, setCode] = useState("")
  const [codeErrors, setCodeErrors] = useState("")
  const { refreshSessionInfo } = useAuthContext()

  const CODE_REGEX = /^\d{6}$/

  const validateCode = () => {
    if (!code.match(CODE_REGEX)) {
      setCodeErrors(t("Please enter a valid 6 digit code."))
      return false
    } else {
      setCodeErrors("")
      return true
    }
  }

  const sendCode = async () => {
    // TODO: Add resend code cooldown
    const resendCodeResult: any = await LAMP.Credential.sendTwoFactorCode()
    if (resendCodeResult?.message === "ok") {
      enqueueSnackbar(t("Successfully sent code"), { variant: "success" })
    } else {
      enqueueSnackbar(t("Failed to resend code."), { variant: "error" })
    }
    console.log("Send code")
  }

  const verifyCode = async () => {
    if (!validateCode()) {
      return
    }
    try {
      const verifyResult: any = await LAMP.Credential.verifyTwoFactorCode(code)
      console.log("verifyResult: ", verifyResult)
      if (verifyResult?.message === "ok") {
        refreshSessionInfo()
        onSuccess && onSuccess()
      } else {
        onError && onError()
      }
    } catch (e) {
      onError && onError()
    }
  }

  return (
    <Box>
      <Typography>
        {t(
          "A six digit code has been sent to you. If you have not received your code, wait a few minutes, and check your spam folder."
        )}
      </Typography>
      <Box marginY={2}>
        <FormGroup>
          <TextField
            id="2fa-code"
            name="code"
            variant="outlined"
            onChange={(event) => {
              setCode(event.target.value)
            }}
            label={t("Code")}
            value={code}
            error={!!codeErrors}
          />
          {!!codeErrors && <FormHelperText error={true}> {codeErrors} </FormHelperText>}
        </FormGroup>
      </Box>
      <Box marginTop={0} marginBottom={3}>
        <Grid container direction="row" justifyContent="space-between">
          <Fab variant="extended" type="button" onClick={sendCode} aria-Label={t("Send code")}>
            {t("Send code")}
          </Fab>
          <Fab
            variant="extended"
            type="button"
            onClick={verifyCode}
            aria-label={t("Verify code")}
            className={classes.blueButton}
          >
            {t("Verify code")}
          </Fab>
        </Grid>
      </Box>
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
