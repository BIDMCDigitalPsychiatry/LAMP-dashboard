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
  setData,
  filterStudies,
  ...props
}: {
  researcher: any
  setData?: Function
  filterStudies?: Function
}) {
  const [updatedData, setUpdatedData] = useState(null)
  const [deletedData, setDeletedData] = useState(null)
  const [newStudy, setNewStudy] = useState(null)
  const [studies, setStudies] = useState(null)
  const [search, setSearch] = useState(null)

  useEffect(() => {
    getDBStudies()
  }, [])

  useEffect(() => {
    if (!!newStudy) getAllStudies()
  }, [newStudy])

  useEffect(() => {
    if (updatedData !== null) getAllStudies()
  }, [updatedData])

  useEffect(() => {
    if (deletedData !== null) {
      let newStudies = studies.filter((item) => {
        if (!!search) {
          return item?.name?.toLowerCase()?.includes(search?.toLowerCase()) && item.id !== deletedData
        } else {
          return item?.id !== deletedData
        }
      })
      setStudies(newStudies)
    } else {
      getAllStudies()
    }
  }, [deletedData])

  const getAllStudies = async () => {
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
      !!filterStudies ? filterStudies(studies) : {}
    })
  }

  const getDBStudies = async () => {
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
      !!filterStudies ? filterStudies(studies) : {}
    })
  }

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
