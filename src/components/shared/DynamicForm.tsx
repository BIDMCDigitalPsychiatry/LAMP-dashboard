import React from "react"
import { Grid, Button, Icon, MuiThemeProvider, Box, Paper, makeStyles, createStyles, Theme } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import Form, { Widgets } from "@rjsf/material-ui"
import { ObjectFieldTemplateProps, utils } from "@rjsf/core"
import { useTranslation } from "react-i18next"
import CustomFileWidget from "./CustomFileWidget"
import { createTheme } from "@material-ui/core/styles"
import locale_lang from "../../locale_map.json"
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
          <Grid container justifyContent="flex-end">
            <Grid item={true}>
              <Button
                className="object-property-expand"
                color="secondary"
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
              >
                <Icon>add</Icon> {t("ADD ITEM")}
              </Button>
            </Grid>
          </Grid>
        )}
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
function ArrayFieldTemplate(props) {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Grid container={true} alignItems="center" className={classes.toolbardashboard}>
      <Box width={1}>
        {props.schema.title && <props.TitleField title={t(props.schema.title)} required={props.required} />}
        {props.schema.description && <props.DescriptionField description={t(props.schema.description)} />}
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
        ArrayFieldTemplate={ArrayFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        widgets={{ TextWidget: AutocompleteTextWidget, FileWidget: CustomFileWidget }}
      />
    </MuiThemeProvider>
  )
}
