import React, { useEffect, useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { Vega } from "react-vega"
import ButtonBase from "@material-ui/core/ButtonBase"
import AddCircleOutline from "@material-ui/icons/AddCircleOutline"
import NativeSelect from "@material-ui/core/NativeSelect"
import { useTranslation } from "react-i18next"

import { emotions } from "./charts/emotions_chart"
import { effective } from "./charts/effective_chart"
import { ineffective } from "./charts/ineffective_chart"
import { actions } from "./charts/actions_chart"
import { selfcare } from "./charts/selfcare_chart"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    graphContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    titleContainer: {
      display: "flex",
      width: 500,
      marginBottom: 40,
      justifyContent: "space-between",
    },
    separator: {
      border: "2px solid rgba(0, 0, 0, 0.1)",
      width: 500,
      marginTop: 50,
      marginBottom: 50,
      height: 0,
    },
    addContainer: {
      display: "flex",
      alignItems: "center",
    },
    addButtonTitle: {
      color: "#5784EE",
      fontWeight: 600,
      fontSize: 14,
    },
    addButton: {
      marginRight: 19,
      color: "#5784EE",
      width: 22,
      height: 22,
      marginLeft: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rangeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 32,
      borderRadius: 16,
      border: "1px solid #C6C6C6",
    },
    rangeTitle: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      fontWeight: "bold",
    },
    rangeButtonSelected: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#ECF4FF",
    },
    rangeTitleSelected: {
      color: "#4C66D6",
      fontSize: 14,
      fontWeight: "bold",
    },
    selector: {
      display: "fixed",
      marginBottom: -30,
      marginRight: -300,
      zIndex: 1000,
    },
  })
)

export default function PreventDBT({ participant, selectedEvents, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [emotionsData, setEmotionsData] = useState(JSON.parse(JSON.stringify(emotions)))
  const [effectiveData, setEffectiveData] = useState(JSON.parse(JSON.stringify(effective)))
  const [ineffectiveData, setIneffectiveData] = useState(JSON.parse(JSON.stringify(ineffective)))
  const [actionsData, setActionsData] = useState(JSON.parse(JSON.stringify(actions)))
  const [selfcareData, setSelfcareData] = useState(JSON.parse(JSON.stringify(selfcare)))

  useEffect(() => {
    let data = []
    let aData = []
    let sData = []
    selectedEvents.map((event) => {
      event.temporal_slices.map((slice) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate()
        var curr_month = date.getMonth() + 1 //Months are zero based
        var curr_year = date.getFullYear()
        let dateString = curr_year + "-" + curr_month + "-" + curr_date
        data.push({ value: slice.value, date: dateString, symbol: slice.item })
        aData.push({ action: slice.item, count: slice.value })
        sData.push({ date: dateString, count: slice.value })
      })
    })

    let actionsD = actionsData
    let emotionsD = emotionsData
    let ineffectiveD = ineffectiveData
    let effectiveD = effectiveData
    let selfcareD = selfcareData

    actionsD.data.values = aData
    emotionsD.data.values = data
    ineffectiveD.data.values = data
    effectiveD.data.values = data
    selfcareD.data.values = sData

    setActionsData(actionsD)
    setEmotionsData(emotionsD)
    setIneffectiveData(ineffectiveD)
    setSelfcareData(selfcareD)
    setEffectiveData(effectiveD)
  }, [])

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={3} />
        <Grid item xs={12} sm={6}>
          <div className={classes.graphContainer}>
            <NativeSelect className={classes.selector}>
              <option value={10}>{t("TEN")}</option>
              <option value={20}>{t("TWENTY")}</option>
              <option value={30}>{t("THIRTY")}</option>
            </NativeSelect>

            <Vega spec={emotionsData} />

            <div className={classes.separator} />

            <NativeSelect className={classes.selector}>
              <option value={10}>{t("TEN")}</option>
              <option value={20}>{t("TWENTY")}</option>
              <option value={30}>{t("THIRTY")}</option>
            </NativeSelect>

            <Vega spec={effectiveData} />

            <div className={classes.separator} />

            <NativeSelect className={classes.selector}>
              <option value={10}>{t("TEN")}</option>
              <option value={20}>{t("TWENTY")}</option>
              <option value={30}>{t("THIRTY")}</option>
            </NativeSelect>

            <Vega spec={ineffectiveData} />

            <div className={classes.separator} />

            <NativeSelect className={classes.selector}>
              <option value={10}>{t("TEN")}</option>
              <option value={20}>{t("TWENTY")}</option>
              <option value={30}>{t("THIRTY")}</option>
            </NativeSelect>

            <Vega spec={actionsData} />

            <div className={classes.separator} />

            <NativeSelect className={classes.selector}>
              <option value={10}>{t("TEN")}</option>
              <option value={20}>{t("TWENTY")}</option>
              <option value={30}>{t("THIRTY")}</option>
            </NativeSelect>

            <Vega spec={selfcareData} />

            <div className={classes.separator} />

            {/* <div className={classes.titleContainer}>
                            <ButtonBase className={classes.addContainer} style={{ marginBottom: 49, marginTop: 15 }}>
                                <div className={classes.addButton}>
                                    <AddCircleOutline />
                                </div>
                                <Typography className={classes.addButtonTitle}>{t("ADD_ITEM")}</Typography>
                            </ButtonBase>
                        </div> */}
          </div>
        </Grid>
        {/* <Grid item xs={12} sm={3} /> */}
      </Grid>
    </div>
  )
}
