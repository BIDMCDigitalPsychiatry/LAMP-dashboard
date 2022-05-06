// Core Imports
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Dashboard from "./Dashboard"
import LAMP from "lamp-core"
import { saveDataToCache, saveDemoData } from "../../components/Researcher/SaveResearcherData"
// import { useWorker } from "@koale/useworker"
import { Service } from "../DBService/DBService"

export default function Researcher({ researcher, onParticipantSelect, mode, tab, ...props }) {
  const { t, i18n } = useTranslation()
  // const [dataWorker] = useWorker(saveDataToCache)
  // const [demoWorker] = useWorker(saveDemoData)

  useEffect(() => {
    ;(async () => {
      let lampAuthId = LAMP.Auth._auth.id
      let lampAuthPswd = LAMP.Auth._auth.password
      // if (LAMP.Auth._type === "researcher") {
      //   lampAuthId === "researcher@demo.lamp.digital"
      //     ? demoWorker()
      //     : dataWorker(lampAuthId + ":" + lampAuthPswd, researcher.id)
      // } else if (LAMP.Auth._type === "admin") {
      //   if (researcher.id) {
      //     dataWorker(lampAuthId + ":" + lampAuthPswd, researcher.id)
      //   }
      // }
      if (LAMP.Auth._type === "researcher") {
        lampAuthId === "researcher@demo.lamp.digital" || lampAuthId === "clinician@demo.lamp.digital"
          ? saveDemoData()
          : saveDataToCache(lampAuthId + ":" + lampAuthPswd, researcher.id)
      } else if (LAMP.Auth._type === "admin") {
        if (researcher.id) {
          saveDataToCache(lampAuthId + ":" + lampAuthPswd, researcher.id)
        }
      }
    })()
  }, [])

  return (
    <React.Fragment>
      <Dashboard onParticipantSelect={onParticipantSelect} researcherId={researcher.id} mode={mode} tab={tab} />
    </React.Fragment>
  )
}
