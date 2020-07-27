import React from "react"
import {
  Box,
  Button,
  Container,
  IconButton,
  makeStyles,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
} from "@material-ui/core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import DataStudioCanvasBody from "./DataStudioCanvasBody"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import RefreshIcon from "@material-ui/icons/Refresh"
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack"
import Tooltip from '@material-ui/core/Tooltip';
import { useLocation  } from "react-router";

const useStyles = makeStyles((theme) => ({
  btnAdd: {
    backgroundColor: "#4696eb",
    color: "#fff",
    borderRadius: 3,
    width: 52,
    height: 52,
    "&:hover": { backgroundColor: "#2277d1" },
  },
  btnremove: {
    backgroundColor: "#eef1f3",
    color: "#000",
    borderRadius: 3,
    width: 52,
    height: 52,
    marginLeft: 10,
  },
  refresh: {
    backgroundColor: "#eef1f3",
    color: "#000",
    borderRadius: 3,
    boxShadow: "none",
    textTransform: "capitalize",
    height: 52,
    marginLeft: 10,
    "&:hover": { boxShadow: "none !important" },
  },
  paper: {
    width: "auto",
    padding: 10,
  },
  formControl: {
    width: "100%",
  },
  selectinput: { paddingTop: "16.5px", paddingBottom: "16.5px" },
  btnnav: { maxWidth: 122 },
  contentarea: { paddingTop: 15, paddingBottom: 15 },
  customdatepicker: {
    maxHeight: 52,
    margin: 0,
    maxWidth: 180,
    "& input": { paddingTop: 16.5, paddingBottom: 16.5, paddingRight: 0 },
    "& div": { paddingRight: 0 },
    "& button": { BackgroundColor: "#f4f4f4 !important" },
  },
  monthduration: {
    padding: "0 10px",
    width: 70,
    maxWidth: 70,
    "& svg": { display: "none" },
  },
  calendarwrap: {
    float: "right",
    padding: 10,
  },
}))

export default function DataStudioCanvas() {
  const confirm = useConfirm();
  const classes = useStyles()
  const [selectedFromDate, setSelectedFromDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));
  const [selectedToDate, setSelectedToDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));
  const [openFromDatePicker, setOpenFromDatePicker] = React.useState(false);
  const [openToDatePicker, setOpenToDatePicker] = React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [changedTemplate, setChangedTemplate] = React.useState(false)  
  const currentLocation = useLocation();
  const locationPathname = currentLocation.pathname;
  const splitLocation = locationPathname.split("/");
  const participantData = JSON.parse(localStorage.getItem("participant_id"))
  const participantId = (splitLocation.length > 2) ? splitLocation[2] : participantData.id;  

  // Get Template List from local storage
  const getTemplateArray = () => {
    return localStorage.getItem("template_list"+"_"+participantId)
              ? JSON.parse(localStorage.getItem("template_list"+"_"+participantId)) : 
                [{ id: 1, template: "Dashboard View 01"}]
  }

  // Get Selected Template data from local storage
  const getSelectedTemplateArray = () => {
    if (localStorage.getItem("template_id"+"_"+participantId)) {
      return JSON.parse(localStorage.getItem("template_id"+"_"+participantId)).id
    } else {
      let newTemplateVal: any = { id: 1, template: "Dashboard View 01" }
      localStorage.setItem("template_id"+"_"+participantId, JSON.stringify(newTemplateVal))
      localStorage.setItem("template_list"+"_"+participantId, JSON.stringify([newTemplateVal]))
      return 1
    }
  }
  
  const [templateArray, setTemplateArray] = React.useState(getTemplateArray())
  const [selectedTemplate, setSelectedTemplate] = React.useState(getSelectedTemplateArray())

  // Store the value as state on changing From Date
  const handleFromDateChange = (date: Date | null) => {
    setSelectedFromDate(date);
    setOpenFromDatePicker(false);
  }

  // Store the value as state on changing To Date
  const handleToDateChange = (date: Date | null) => {
    setSelectedToDate(date)
    setOpenToDatePicker(false);
  }

  // Onchange Load Template data from local Storage
  const handleTemplate = (event) => {
    setChangedTemplate(true)
    setSelectedTemplate(event.target.value)
    let temp = event.target.value
    let templateVal = temp >= 9 ? temp : "0" + temp
    let newTemplateVal: any = { id: temp, template: "Dashboard View " + templateVal }
    localStorage.setItem("template_id"+"_"+participantId, JSON.stringify(newTemplateVal))
    window.location.reload(false)
  }

  // Create new Template
  const addNewTemplate = () => {
    let maxTempId = Math.max.apply(Math, templateArray.map(function(o) { return o.id; }));
    let newTempVal = maxTempId + 1
    let updatedTemplate = templateArray
    let templateVal = updatedTemplate.length > 9 ? newTempVal : "0" + newTempVal
    let newTemplate: any = { id: newTempVal, template: "Dashboard View " + templateVal }
    updatedTemplate = [...templateArray, newTemplate]
    setTemplateArray(updatedTemplate)
    localStorage.setItem("template_id"+"_"+participantId, JSON.stringify(newTemplate))
    setSelectedTemplate(newTempVal)
    localStorage.setItem("template_list"+"_"+participantId, JSON.stringify(updatedTemplate))
    enqueueSnackbar("Successfully created a template.", {
      variant: "success",
      action: (key) => (
        <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
          Dismiss
        </Button>
      )
    });
    window.location.reload(false);
  }

  // Remove Selected Template
  const removeSavedTemplate = () => {
    let templateId = JSON.parse(localStorage.getItem('template_id'+"_"+participantId));
    confirm({ 
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText:  `Yes`,
      cancellationText:  `No`
    })
    .then(() =>{
      let templateList = JSON.parse(localStorage.getItem("template_list"+"_"+participantId));
      if(templateList.length > 1){
        // get index of object with id:1
        var removeIndex = templateList.map(function(item) { return item.id; }).indexOf(templateId.id);
        templateList.splice(removeIndex, 1);      
        localStorage.setItem("template_list"+"_"+participantId, JSON.stringify(templateList));
        let newTemplateList = JSON.parse(localStorage.getItem("template_list"+"_"+participantId));
        let firstTemplate = newTemplateList[0];
        localStorage.setItem("template_id"+"_"+participantId, JSON.stringify(firstTemplate));
        localStorage.removeItem('template_'+templateId.id+"_"+participantId); 
        enqueueSnackbar("Successfully deleted the template.", {
          variant: "success",
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          )
        });
        window.location.reload(false);
      }else{
        enqueueSnackbar("Could not delete this template as at least one template should be left in the application.", {
          variant: "error",
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          )
        });
      }
    })
    .catch((e) => {
      if (e !== undefined) {
        enqueueSnackbar("An error has been occured while deleting the data.", {
          variant: "error",
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          ),
        })
      }
    })
  }

  const handleDateDuration = () => {
    console.log('Duration');  
  }
  
  return (
    <React.Fragment>
      <Container maxWidth="xl" className={classes.contentarea}>
        <Grid container spacing={3}>
          <Grid item lg={4}>
            <Paper className={classes.paper}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <FormControl variant="outlined" classes={{ root: classes.formControl }}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      classes={{ selectMenu: classes.selectinput }}
                      id="demo-simple-select-outlined"
                      value={selectedTemplate}
                      onChange={handleTemplate}
                    >
                      {templateArray.map((templateVal) => (
                        <MenuItem key={templateVal.id} value={templateVal.id}>
                          {templateVal.template}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs className={classes.btnnav}>
                  <Tooltip title="Add Template">
                    <IconButton aria-label="Add" className={classes.btnAdd} onClick={addNewTemplate}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Template">
                    <IconButton aria-label="ARemovedd" className={classes.btnremove} onClick={removeSavedTemplate}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.calendarwrap}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  inputVariant="outlined"
                  margin="normal"
                  id="date-from-picker-inline"
                  className={classes.customdatepicker}
                  value={selectedFromDate}
                  onChange={handleFromDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Box component="span" className={classes.monthduration}>
                <FormControl variant="outlined">
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    classes={{ selectMenu: classes.selectinput }}
                    id="demo-simple-select-outlined" onChange={handleDateDuration}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>6M</MenuItem>
                    <MenuItem value={20}>4M</MenuItem>
                    <MenuItem value={30}>2M</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  inputVariant="outlined"
                  margin="normal"
                  id="date-to-picker-inline"
                  className={classes.customdatepicker}
                  value={selectedToDate}
                  onChange={handleToDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />  
              </MuiPickersUtilsProvider>
              <Tooltip title="Refresh">
                <Button variant="contained" color="default" className={classes.refresh} startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
              </Tooltip>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <DataStudioCanvasBody dataSelectedTemplate={selectedTemplate} 
            templateChanged={ changedTemplate }/> 
    </React.Fragment>
  ) 
}