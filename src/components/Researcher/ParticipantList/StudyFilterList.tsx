import React, { useState, useEffect } from "react"
import { Box, Fab } from "@material-ui/core"
// Local Imports
import LAMP, { StudyService } from "lamp-core"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import { Service } from "../../DBService/DBService"

export interface NewStudy {
  id?: string
  study_name?: string
}
export interface Study {
  id?: string
  name?: string
}
export interface Researcher {
  id?: string
}
export default function StudyFilterList({
  studies,
  researcher,
  type,
  showFilterStudies,
  setSelectedStudies,
  selectedStudies,
  updateCount,
  setUpdateCount,
  ...props
}: {
  studies?: Array<any>
  researcher?: Researcher
  type?: string
  showFilterStudies?: Boolean
  setSelectedStudies?: Function
  selectedStudies?: Array<string>
  updateCount?: number
  setUpdateCount?: Function
}) {
  const { t } = useTranslation()
  const [studiesCount, setStudiesCount] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const [studs, setStuds] = useState(studies)

  useEffect(() => {
    refreshStudies()
  }, [])

  useEffect(() => {
    refreshStudies()
  }, [studies])

  const refreshStudies = () => {
    Service.getAll("studies").then((data) => {
      setStuds(data || [])
    })
    setUpdateCount(0)
  }

  useEffect(() => {
    let isMounted = true
    refreshStudies()
    return () => {
      isMounted = false
    }
  }, [updateCount])

  useEffect(() => {
    let studiesData = filterStudyData(studs)
    setStudiesCount(studiesData)
  }, [studs])

  const filterStudyData = (dataArray) => {
    return Object.assign(
      {},
      ...dataArray.map((item) => ({
        [item.name]:
          type === "activities" || updateCount === 2
            ? item.activity_count
            : type === "sensors" || updateCount === 3
            ? item.sensor_count
            : item.participant_count,
      }))
    )
  }

  return (
    <Box>
      {showFilterStudies === true && (
        <Box mt={1}>
          {
            <MultipleSelect
              selected={selectedStudies}
              items={(studs || []).map((x) => `${x.name}`)}
              showZeroBadges={false}
              badges={studiesCount}
              onChange={(x) => {
                if (x.length > 0) {
                  LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", x)
                  setSelectedStudies(x)
                } else {
                  enqueueSnackbar(t("Atleast 1 study should be selected."), {
                    variant: "error",
                  })
                }
              }}
            />
          }
        </Box>
      )}
    </Box>
  )
}
