// Core Imports
import React, { lazy, Suspense, useEffect } from "react"
import { useTranslation } from "react-i18next"
import locale_lang from "../../locale_map.json"
import LAMP from "lamp-core"
import { saveDemoData } from "../../components/Researcher/SaveResearcherData"
import { lazyRetry } from "../../helper/functions"
const Dashboard = lazy(lazyRetry(() => import("./Dashboard")))

export default function Researcher({ researcher, onParticipantSelect, mode, tab, ...props }) {
  const { t, i18n } = useTranslation()

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang)?.filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes?.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useEffect(() => {
    let language = !!localStorage.getItem("LAMP_user_" + researcher.id)
      ? JSON.parse(localStorage.getItem("LAMP_user_" + researcher.id)).language
      : getSelectedLanguage()
      ? getSelectedLanguage()
      : "en-US"
    i18n.changeLanguage(language)
    ;(async () => {
      let lampAuthId = LAMP.Auth._auth.id

      if (LAMP.Auth._type === "researcher") {
        lampAuthId === "researcher@demo.lamp.digital" || lampAuthId === "clinician@demo.lamp.digital"
          ? saveDemoData()
          : ""
      }
    })()
  }, [])

  return (
    <React.Fragment>
      <Suspense fallback={<div />}>
        <Dashboard onParticipantSelect={onParticipantSelect} researcherId={researcher.id} mode={mode} tab={tab} />
      </Suspense>
    </React.Fragment>
  )
}
