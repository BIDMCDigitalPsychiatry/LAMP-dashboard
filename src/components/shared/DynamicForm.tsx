import React from "react"
import { Grid, Button, Icon, createMuiTheme, MuiThemeProvider } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import Form, { Widgets } from "@rjsf/material-ui"
import { ObjectFieldTemplateProps, utils } from "@rjsf/core"
import { useTranslation } from "react-i18next"

// By customizing the ObjectFieldTemplate used by React-JSONSchema-Form, we add support for the new
// "ui:grid" parameter, which allows customizing grid placement (flexbox) in Material-UI (containers and items).
// Supported container props: alignContent, alignItems, direction, justify, spacing, wrap
// Supported item props: lg, md, sm, xs, xl
// TODO: Does not support adding dividers or padding before/after the children items yet.
const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  disabled,
  readonly,
  uiSchema,
  idSchema,
  schema,
  formData,
  onAddClick,
}: ObjectFieldTemplateProps) => {
  const { t } = useTranslation()
  return (
    <>
      {!!properties && (properties || []).length > 0 && (uiSchema["ui:title"] || title) && (
        <TitleField id={`${idSchema.$id}-title`} title={t(title)} required={required} />
      )}
      {description && <DescriptionField id={`${idSchema.$id}-description`} description={t(description)} />}
      <Grid container={true} spacing={2} style={{ marginTop: 10 }} {...(uiSchema?.["ui:grid"] ?? {})}>
        {properties.map((element: any, index: number) => (
          <Grid
            item={true}
            xs={12}
            key={index}
            style={{ marginBottom: "10px" }}
            {...(element.content.props.uiSchema?.["ui:grid"] ?? {})}
          >
            {element.content}
          </Grid>
        ))}
        {utils.canExpand(schema, uiSchema, formData) && (
          <Grid container justify="flex-end">
            <Grid item={true}>
              <Button
                className="object-property-expand"
                color="secondary"
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
              >
                <Icon>add</Icon> Add Item
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  )
}

// By default, the React-JSONSchema-Form does not link correctly to the main UI theme, so declare it here.
const formTheme = createMuiTheme({
  props: {
    MuiTextField: {
      variant: "filled",
    },
    MuiPaper: {
      variant: "outlined",
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
  },
})
// This function recursively extracts all "ui:"-prefixed properties within the JSONSchema.
// These are passed to the JSONSchemaForm as a single nested uiSchema object.
// TODO: Does not resolve dependencies, oneOf, allOf, anyOf, etc. internal props.
function _extract(schema) {
  /* prettier-ignore */
  return {
    ...Object.fromEntries(Object.entries(schema).filter(([k, v]) => k.startsWith("ui:"))),
    ...(!!schema.properties ? Object.fromEntries(Object.entries(schema.properties).map(([k, v]) => [k, _extract(v)])) : {}),
    ...(!!schema.items?.properties ? {
      items: Object.fromEntries(Object.entries(schema.items.properties).map(([k, v]) => [k, _extract(v)])),
    } : {}),
  }
}

// Add support for the "examples" array for the property as an auto-complete menu.
function AutocompleteTextWidget(props) {
  if (!Array.isArray(props.schema.examples)) {
    return <Widgets.TextWidget {...props} />
  }

  return (
    <Autocomplete
      onChange={(_, data) => props.onChange(data)}
      freeSolo
      options={props.schema.examples ?? []}
      renderInput={(params) => <Widgets.TextWidget {...params} {...props} />}
      {...(props.uiSchema ?? {})}
      value={props.value}
    />
  )
}

// A wrapper Form component to add support for things not available out of the box in RJSF.
// NOTE: Do not keep resetting the value of `initialData`! Only set this once.
export default function DynamicForm({ schema, initialData, onChange, ...props }) {
  return (
    <MuiThemeProvider theme={formTheme}>
      <Form
        liveValidate
        children={true}
        schema={schema}
        uiSchema={_extract(schema)}
        formData={initialData}
        onChange={(x) => {
          onChange(x.formData)
        }}
        ObjectFieldTemplate={ObjectFieldTemplate}
        widgets={{ TextWidget: AutocompleteTextWidget }}
      />
    </MuiThemeProvider>
  )
}
