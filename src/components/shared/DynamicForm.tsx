import React from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core"
import Form from "@rjsf/material-ui"

const formTheme = createMuiTheme({
  props: {
    MuiTextField: {
      variant: "filled",
    },
    MuiPaper: {
      variant: "outlined",
    },
  },
})

// This function recursively extracts all "ui:"-prefixed properties within the JSONSchema.
// These are passed to the JSONSchemaForm as a single nested uiSchema object.
function _extract(schema) {
  /* prettier-ignore */
  return {
    ...Object.fromEntries(Object.entries(schema).filter(([k, v]) => k.startsWith("ui:"))),
    ...(!!schema.properties ? Object.fromEntries(Object.entries(schema.properties).map(([k, v]) => [k, _extract(v)])) : {}),
    ...(!!schema.items ? Object.fromEntries(Object.entries(schema.items).map(([k, v]) => [k, _extract(v)])) : {}),
  }
}

export default function DynamicForm({ schema, data, onChange, ...props }) {
  return (
    <MuiThemeProvider theme={formTheme}>
      <Form
        liveValidate
        children={true}
        schema={schema}
        uiSchema={_extract(schema)}
        formData={data}
        onChange={(x) => onChange(x.formData)}
      />
    </MuiThemeProvider>
  )
}
