import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Button,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Card,
  CardContent,
  Badge,
} from "@material-ui/core"
import { DatePicker } from "@material-ui/pickers"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next";

interface MedicationItem {
  title: string
  startDate: Date
  endDate: Date
  dosage: string
}

export default function MedicationTracker({ onComplete, ...props }) {
  const [date, changeDate] = useState(new Date())
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation();

  useEffect(() => {
    enqueueSnackbar(t("This is a demo only. Entries will not be saved."), {
      variant: "info",
    })
  }, [])

  const openDialog = () => {
    setOpen(true)
  }
  const openDialog2 = () => {
    setOpen2(true)
  }
  const closeDialog = () => {
    setOpen(false)
  }
  const closeDialog2 = () => {
    setOpen2(false)
  }
  const [selectedDays, setSelectedDays] = useState([1, 2, 15])
  const [selectedDate, handleDateChange] = useState(new Date())
  const [selectedDateEnd, handleDateChangeEnd] = useState(new Date())

  return (
    <Container maxWidth="sm">
      <Box display="flex" border={2} borderColor="grey.300" borderRadius={8} bgcolor="#fff" p={5} my={5}>
        <DatePicker
          autoOk
          orientation="landscape"
          variant="static"
          openTo="date"
          value={date}
          onChange={changeDate}
          renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
            const isSelected = isInCurrentMonth && selectedDays.includes(date.getDate())
            return (
              <Badge badgeContent={isSelected ? <Icon fontSize="small">adjust_sharp</Icon> : undefined}>
                {dayComponent}
              </Badge>
            )
          }}
        />
      </Box>
      <Button style={{ margin: 8 }} variant="contained" startIcon={<Icon>star_border</Icon>} onClick={openDialog2}>
        {t("My Medications")}
      </Button>
      <Dialog fullWidth={true} open={open2} onClose={closeDialog2}>
        <DialogTitle> {t("My Medications")} </DialogTitle>
        <DialogContent>
          <Card style={{ margin: 16 }}>
            <CardContent>
              <Typography>Medication 1</Typography>
              <Typography variant="body2">Dose: 100mg</Typography>
              <Icon fontSize="small">access_time</Icon>
              <Typography variant="body2">Every day at 12:00pm</Typography>
              <Button size="small" startIcon={<Icon>edit</Icon>}>
                {t("Edit")}
              </Button>
            </CardContent>
          </Card>
          <Card style={{ margin: 16 }}>
            <CardContent>
              <Typography>Medication 2</Typography>
              <Typography variant="body2">Dose: 50mg</Typography>
              <Icon fontSize="small">access_time</Icon>
              <Typography variant="body2">Every day at 12:00pm</Typography>
              <Button size="small" startIcon={<Icon>edit</Icon>}>
                {t("Edit")}
              </Button>
            </CardContent>
          </Card>
          <Card style={{ margin: 16 }}>
            <CardContent>
              <Typography>Medication 3</Typography>
              <Typography variant="body2">Dose: 20mg</Typography>
              <Icon fontSize="small">access_time</Icon>
              <Typography variant="body2">Every day at 12:00pm</Typography>
              <Button size="small" startIcon={<Icon>edit</Icon>}>
                {t("Edit")}
              </Button>
            </CardContent>
          </Card>
          <DialogActions>
            <Button onClick={closeDialog2} startIcon={<Icon>close</Icon>}>
              {t("Close")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog> 
      <Button style={{ margin: 8 }} variant="contained" startIcon={<Icon>add</Icon>} onClick={openDialog}>
        {t("Add Medication")}
      </Button>
      <Dialog fullWidth={true} open={open} onClose={closeDialog}>
        <Container>
          <DialogTitle> {t("Add Medication")} </DialogTitle>
          <DialogContent> </DialogContent>
          <TextField fullWidth={true} autoFocus margin="normal" variant="outlined" label={t("Medication Name")} />
          <div></div>
          <TextField autoFocus margin="normal" variant="outlined" label={t("Dose")} />
          <Typography>{t("Set reminder?")} </Typography>
          {/* <Switch color="primary"> fsdfg</Switch> */}
          <div></div>
          <DatePicker label={t("Start Date")} value={selectedDate} onChange={handleDateChange} animateYearScrolling />
          <div></div>
          <DatePicker label={t("End Date")} value={selectedDateEnd} onChange={handleDateChangeEnd} animateYearScrolling />
          <DialogActions>
            <Button onClick={closeDialog} startIcon={<Icon>delete</Icon>}>
              {t("Cancel")}
            </Button>
            <Button onClick={closeDialog} startIcon={<Icon>save</Icon>}>
              {t("Save")} 
            </Button>
          </DialogActions>
        </Container>
      </Dialog>
    </Container>
  )
} 
  