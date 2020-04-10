
// Core Imports 
import React, { useState, useEffect } from 'react'
import { Box, Container, TextField, Button, Grid, Icon } from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { useSnackbar } from 'notistack'

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(new Date('2020-04-25T21:11:54'))
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    enqueueSnackbar(`This is a demo only. Entries will not be saved.`, { variant: 'info'})
  }, [])

  return (
    <Container maxWidth="sm">
      <Box display="flex" border={2} borderColor="grey.300" borderRadius={8} bgcolor="#fff" p={5} my={10}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            label="Today's Date"
            value={selectedDate}
            onChange={date => setSelectedDate(date)}
          />
        </Grid>
      </Box>
      <Box border={1} borderColor="grey.300" borderRadius={8} bgcolor="#fff">
        <TextField 
          label="Type Here" 
          variant="outlined"
          multiline
          rows="15" 
          fullWidth 
        />
      </Box>
      <div>
        <Button startIcon={<Icon fontSize='large'>save</Icon>} variant="contained">Save</Button>
        <Button startIcon={<Icon fontSize='large'>delete</Icon>} variant="contained">Delete</Button>
      </div>
    </Container>
  )
}      
    