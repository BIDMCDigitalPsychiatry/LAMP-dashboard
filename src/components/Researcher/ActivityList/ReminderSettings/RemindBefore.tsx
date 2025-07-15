import React, { useEffect, useState } from "react"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import FormControl from "@material-ui/core/FormControl"
import Grid from "@material-ui/core/Grid"

import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme" // TypeScript type
import Repeat from "./Repeat"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formouter: {
      position: "relative",
      marginBottom: 15,
    },
    formlabel: {
      position: "absolute",
      zIndex: 1,
      fontSize: 12,
      color: "#666",
      left: 13,
      top: 7,
    },
    formSelect: {
      width: "100%",
      border: 0,
      borderRadius: 4,
      "&:hover": {
        borderColor: "rgba(0,0,0,1)",
      },
      "&:focus": {
        borderColor: "rgba(0,0,0,1)",
      },
    },
  })
)
export default function RemindBefore({ ...props }) {
  const classes = useStyles()
  const [options, setOptions] = useState(props?.options ?? [])
  const [repeatOptions, setRepeatOptions] = useState([])
  const [data, setData] = useState(props?.value ?? null)

  useEffect(() => {
    setOptions(props?.options)
    setData(props.value)
    if (!!props.value) setRepeatOptions(props?.options.find((option) => option.value === props.value?.before)?.every)
  }, [props?.options])

  useEffect(() => {
    if (!!data?.before) setRepeatOptions(options.find((option) => option.value === data?.before)?.every)
  }, [data?.before])

  useEffect(() => {
    if (data !== props.value) props.onUpdate(data)
  }, [data])

  return (
    <>
      <Grid item xs={4} className={classes.formouter}>
        <FormControl variant="outlined" size="medium" className={classes.formSelect}>
          <label className={classes.formlabel}>Before</label>
          <Select
            variant="filled"
            label="text"
            disabled={props.disabled}
            value={data?.before ?? ""}
            onChange={(event) => {
              setData({ ...data, before: event.target?.value })
            }}
          >
            <MenuItem value={null}>Select</MenuItem>
            {options.map((option) => (
              <MenuItem value={option.value}>{option.text}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {(repeatOptions || []).length > 0 && (
        <Repeat
          disabled={props.disabled}
          options={repeatOptions ?? []}
          value={data?.every}
          onUpdate={(every) => {
            setData({ ...data, every })
          }}
        />
      )}
    </>
  )
}
