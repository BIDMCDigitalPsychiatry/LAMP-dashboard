import React, { useState, useEffect } from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"

import StudiesList from "./Studies/Index"
import { ResponsivePaper } from "../Utils"
import { ReactComponent as Patients } from "../../icons/Patients.svg"
import { ReactComponent as Activities } from "../../icons/Activities.svg"
import { ReactComponent as Sensors } from "../../icons/Sensor.svg"
import { ReactComponent as Studies } from "../../icons/Study.svg"
import { useTranslation } from "react-i18next"
import { Service } from "../DBService/DBService"
import LAMP from "lamp-core"

export default function DashboardStudies({
  researcher,
  data,
  setData,
  filterStudies,
  ...props
}: {
  researcher: any
  data?: any
  setData?: Function
  filterStudies?: Function
}) {
  const [updatedData, setUpdatedData] = useState(null)
  const [deletedData, setDeletedData] = useState(null)
  const [newStudy, setNewStudy] = useState(null)
  const [studies, setStudies] = useState(data ?? null)
  const [search, setSearch] = useState(null)

  useEffect(() => {
    getAllStudies()
  }, [])

  useEffect(() => {
    if (!!newStudy) getAllStudies()
  }, [newStudy])

  useEffect(() => {
    if (updatedData !== null) getAllStudies()
  }, [updatedData])

  useEffect(() => {
    getAllStudies()
  }, [deletedData])

  const getAllStudies = async () => {
    if (!!data) {
      setStudies(data)
      !!setData ? setData(data) : {}
      !!filterStudies ? filterStudies(data) : {}
    } else {
      Service.getAll("studies").then((studies) => {
        setStudies(studies)
        !!setData ? setData(studies) : {}
        !!filterStudies ? filterStudies(studies) : {}
      })
    }
  }

  useEffect(() => {
    setStudies(data)
    !!setData ? setData(data) : {}
    !!filterStudies ? filterStudies(data) : {}
  }, [data])

  return (
    <StudiesList
      title={null}
      researcher={researcher}
      studies={studies}
      upatedDataStudy={(data) => setUpdatedData(data)}
      deletedDataStudy={(data) => setDeletedData(data)}
      searchData={(data) => setSearch(data)}
      newAdddeStudy={setNewStudy}
    />
  )
}
