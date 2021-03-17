// Core Imports
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import locale_lang from "../../locale_map.json"
import Dashboard from "./Dashboard"
import LAMP from "lamp-core"
import { saveDataToCache, saveDemoData } from "../../components/Researcher/SaveResearcherData"

export default function Researcher({ researcher, onParticipantSelect, ...props }) {
  const { t, i18n } = useTranslation()
  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
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
      let lampAuthPswd = LAMP.Auth._auth.password
      let lampAuthMe = LAMP.Auth._me
      if (LAMP.Auth._type === "researcher") {
        lampAuthId === "researcher@demo.lamp.digital"
          ? await saveDemoData()
          : await saveDataToCache(lampAuthId + ":" + lampAuthPswd, researcher.id)
      } else if (LAMP.Auth._type === "admin") {
        if (researcher.id) {
          await saveDataToCache(lampAuthId + ":" + lampAuthPswd, researcher.id)
        }
      }
    })()
  }, [])

  return (
    <React.Fragment>
      <Dashboard onParticipantSelect={onParticipantSelect} researcher={researcher} />
    </React.Fragment>
  )
}
