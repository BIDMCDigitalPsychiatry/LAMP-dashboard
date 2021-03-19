import React, { useState, useEffect } from "react"
import { Box, Typography, TextField, InputBase } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: 50,
      backgroundColor: "#F8F8F8",
      "&:hover": {
        backgroundColor: "#eee",
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        width: "450px",
      },
      [theme.breakpoints.down("md")]: {
        width: "300px",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: "15px 10px",
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        width: "20ch",
      },
    },
  })
)
export default function Header({ searchData, ...props }: { searchData: Function }) {
  const classes = useStyles()
  const [search, setSearch] = useState("")
  useEffect(() => {
    searchData(search)
  }, [search])
  return (
    <Box>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          value={search}
        />
      </div>
    </Box>
  )
}
