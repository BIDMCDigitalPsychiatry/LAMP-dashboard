import React from "react"
import { Grid, Button, Icon, MuiThemeProvider, Box, Paper, makeStyles, createStyles, Theme } from "@material-ui/core"
import Form from "@rjsf/material-ui"
import {
  ObjectFieldTemplateProps,
  TitleFieldProps,
  DescriptionFieldProps,
  ArrayFieldTemplateProps,
  RegistryWidgetsType,
  RegistryFieldsType,
  optionId,
} from "@rjsf/utils"
import { useTranslation } from "react-i18next"
import CustomFileWidget from "./CustomFileWidget"
import { createTheme } from "@material-ui/core/styles"
import locale_lang from "../../locale_map.json"
import validator from "@rjsf/validator-ajv8"
import { zhCN, enUS, koKR, hiIN, deDE, daDK, frFR, itIT, esES, zhHK } from "@mui/material/locale"

const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN", "zh-HK"]
const languageObjects = {
  "en-US": enUS,
  "es-ES": esES,
  "hi-IN": hiIN,
  "de-DE": deDE,
  "da-DK": daDK,
  "fr-FR": frFR,
  "ko-KR": koKR,
  "it-IT": itIT,
  "zh-CN": zhCN,
  "zh-HK": zhHK,
}
// By customizing the ObjectFieldTemplate used by React-JSONSchema-Form, we add support for the new
// "ui:grid" parameter, which allows customizing grid placement (flexbox) in Material-UI (containers and items).
// Supported container props: alignContent, alignItems, direction, justify, spacing, wrap
// Supported item props: lg, md, sm, xs, xl
// TODO: Does not support adding dividers or padding before/after the children items yet.

function TitleFieldTemplate(props: TitleFieldProps) {
  const { id, required, title } = props
  return (
    <header id={id}>
      {title}
      {required && <mark>*</mark>}
    </header>
  )
}

function DescriptionFieldTemplate(props: DescriptionFieldProps) {
  const { description, id } = props
  return <small id={id}>{description}</small>
}

function AutoCompleteTemplate(props: DescriptionFieldProps) {
  const { description, id } = props
  return <small id={id}>{description}</small>
}

//TextWidget: AutocompleteTextWidget,
const widgets: RegistryWidgetsType = {
  FileWidget: CustomFileWidget,
}

const ObjectFieldTemplate = ({
  description,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
  schema,
  registry,
}: ObjectFieldTemplateProps) => {
  const { t } = useTranslation()
  return (
    <>
      {/* {!!properties && (properties || []).length > 0 && (uiSchema["ui:title"] || title) && (
        <TitleFieldTemplate id={`${idSchema.$id}-title`} title={t(title)} required={required} registry={registry} schema={schema} />
      )} */}
      {description && (
        <DescriptionFieldTemplate
          id={`${idSchema.$id}-description`}
          description={t(description)}
          registry={registry}
          schema={schema}
        />
      )}
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
      </Grid>
    </>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      border: "1px solid rgba(0, 0, 0, 0.12)",
      borderRadius: 4,
      padding: 16,
    },
    addbtn: {
      color: "#f50057",
    },
    btnarrange: {
      background: "transparent",
      border: "none",
      "& span": {
        fontSize: "1.25rem",
      },
    },
  })
)

function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <Grid container={true} alignItems="center" className={classes.toolbardashboard}>
      <Box width={1}>
        {props.schema.title && (
          <TitleFieldTemplate
            id={props.idSchema.$id}
            title={t(props.schema.title)}
            required={props.required}
            schema={props.schema}
            registry={props.registry}
          />
        )}
        {props.schema.description && (
          <DescriptionFieldTemplate
            description={t(props.schema.description)}
            id={props.idSchema.$id}
            schema={props.schema}
            registry={props.registry}
          />
        )}
      </Box>
      {props.items.map((element, index) => (
        <Grid container={true} alignItems="center">
          <Grid item={true} xs style={{ overflow: "auto" }}>
            <Box mb={2}>
              <Paper elevation={2}>
                <Box p={2}>{element.children}</Box>
              </Paper>
            </Box>
          </Grid>
          {element.hasToolbar && (
            <Grid item={true}>
              {(element.hasMoveUp || element.hasMoveDown) && (
                <button
                  disabled={element.disabled || element.readonly}
                  onClick={element.onReorderClick(index, index - 1)}
                  className={classes.btnarrange}
                >
                  <Icon>arrow_upward</Icon>
                </button>
              )}
              {(element.hasMoveUp || element.hasMoveDown) && (
                <button
                  disabled={element.disabled || element.readonly}
                  onClick={element.onReorderClick(index, index + 1)}
                  className={classes.btnarrange}
                >
                  <Icon>arrow_downward</Icon>
                </button>
              )}
              {element.hasCopy && (
                <button
                  onClick={element.onCopyIndexClick(index)}
                  disabled={element.disabled || element.readonly}
                  className={classes.btnarrange}
                >
                  <Icon>content_copy</Icon>
                </button>
              )}
              {element.hasRemove && (
                <button
                  onClick={element.onDropIndexClick(index)}
                  disabled={element.disabled || element.readonly}
                  className={classes.btnarrange}
                >
                  <Icon>remove</Icon>
                </button>
              )}
            </Grid>
          )}
        </Grid>
      ))}
      {props.canAdd && (
        <Box display="flex" justifyContent="flex-end" width={1}>
          <Button type="button" onClick={props.onAddClick} className={classes.addbtn}>
            <Icon>add</Icon>
            {`${t("Add Item")}`}
          </Button>
        </Box>
      )}
    </Grid>
  )
}

// Helper function to recursively extract dependencies (can be objects or arrays)
function _extractDependencies(dependencies) {
  if (Array.isArray(dependencies)) {
    return dependencies.map((dep) => _extract(dep))
  } else if (typeof dependencies === "object") {
    return Object.fromEntries(Object.entries(dependencies).map(([key, value]) => [key, _extract(value)]))
  }
  return dependencies // In case it's not an object or array, return as-is
}

// By default, the React-JSONSchema-Form does not link correctly to the main UI theme, so declare it here.
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
    // Handle "dependencies" (which can be an object or an array of schemas)
    ...(schema.items?.dependencies ? { dependencies: _extractDependencies(schema.items?.dependencies) } : {}),
    // Handle "oneOf", "allOf", and "anyOf" (arrays of schemas)
    ...(schema.oneOf ? { oneOf: schema.oneOf.map(_extract) } : {}),
    ...(schema.allOf ? { allOf: schema.allOf.map(_extract) } : {}),
    ...(schema.anyOf ? { anyOf: schema.anyOf.map(_extract) } : {}),
     // Handle "enum" if it's present in the schema (to process enums)
     ...(schema.enum ? { enum: schema.enum.map(e => e) } : {}),
    
     // Handle "title", "description", etc.
     ...(schema.title ? { title: schema.title } : {}),
     ...(schema.description ? { description: schema.description } : {}),
  }
}

// A wrapper Form component to add support for things not available out of the box in RJSF.
// NOTE: Do not keep resetting the value of `initialData`! Only set this once.
export default function DynamicForm({ schema, initialData, onChange, ...props }) {
  const { t, i18n } = useTranslation()

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }

  const formTheme = createTheme(
    {
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
            "& textarea": {
              resize: "vertical",
            },
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
        MuiTypography: {
          h5: { fontSize: 16, fontWeight: 600, marginBottom: 10 },
        },
      },
    },
    languageObjects[getSelectedLanguage()]
  )

  return (
    <MuiThemeProvider theme={formTheme}>
      <Form
        // liveValidate
        children={true}
        schema={schema}
        uiSchema={_extract(schema)}
        formData={initialData}
        onChange={(x) => {
          onChange(x.formData)
        }}
        validator={validator}
        templates={{ ArrayFieldTemplate, ObjectFieldTemplate, TitleFieldTemplate }}
        widgets={widgets}
      />
    </MuiThemeProvider>
  )
}
