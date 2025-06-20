import React, { useState } from "react"
import { Box, makeStyles } from "@material-ui/core"
import Autosuggest from "react-autosuggest"
import i18n from "./../../i18n"

const useStyles = makeStyles((theme) => ({
  autoSuggest: {
    "& input": {
      backgroundColor: "#f4f4f4",
      width: "100%",
      padding: 15,
      borderRadius: 5,
      border: 0,
      fontSize: 16,
      "&:focus-visible": {
        outline: 0,
      },
      "&:hover": {
        backgroundColor: "#ddd",
      },
    },
    "& .react-autosuggest__suggestions-container": {
      backgroundColor: "#f8f8f8",
      "& ul": {
        margin: "2px 0 0 0",
        padding: 0,
        "& li": {
          listStyle: "none",
          borderBottom: "#fff solid 1px",
          padding: "8px 15px",
          "&:hover": {
            backgroundColor: "#d6d6d6",
          },
        },
      },
    },
  },
}))
// Imagine you have a list of languages that you'd like to autosuggest.
const emotions = [
  { key: "happiness", value: i18n.t("Happiness") },
  { key: "sadness", value: i18n.t("Sadness") },
  { key: "fear", value: i18n.t("Fear") },
  { key: "anger", value: i18n.t("Anger") },
  { key: "neutral", value: i18n.t("Neutral") },
]

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0
    ? []
    : emotions.filter((emotion) => emotion.key.toLowerCase().slice(0, inputLength) === inputValue)
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.key

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion.value}</div>

export default function AutoSuggest(props) {
  const classes = useStyles()

  const [value, setValue] = useState(props?.value ?? "")
  const [suggestions, setSuggestions] = useState([])
  const onChange = (event, { newValue }) => {
    props.onChange(newValue)
    setValue(newValue)
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  // const { value, suggestions } = this.state;

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Type your choice",
    value,
    onChange,
  }

  // Finally, render it!
  return (
    <Box className={classes.autoSuggest}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </Box>
  )
}
