import React, { useEffect, useState } from "react"
import { MenuItem, Select, FormControl, makeStyles, Theme, createStyles, Grid } from "@material-ui/core"
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
  const [options, setOptions] = useState([])
  const [repeatOptions, setRepeatOptions] = useState([])
  const [selected, setSelected] = useState("")

  useEffect(() => {
    setOptions(props?.options)
  }, [props])

  useEffect(() => {
    console.log(options)
  }, [options])

  useEffect(() => {
    setRepeatOptions(options.find((option) => option.value === selected)?.every)
  }, [selected])

  return (
    <>
      <Grid item xs={4} className={classes.formouter}>
        <FormControl variant="outlined" size="medium" className={classes.formSelect}>
          <label className={classes.formlabel}>Before</label>
          <Select
            variant="filled"
            label="text"
            value={selected}
            onChange={(event) => {
              setSelected(event.target?.value)
            }}
          >
            {options.map((option) => (
              <MenuItem value={option.value}>{option.text}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {(repeatOptions || []).length > 0 && <Repeat options={repeatOptions ?? []} />}
    </>
  )
}
