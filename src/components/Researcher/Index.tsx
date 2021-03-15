// Core Imports
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import locale_lang from "../../locale_map.json"
import Dashboard from "./Dashboard"

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
  }, [])

  return (
    <React.Fragment>
      <Dashboard onParticipantSelect={onParticipantSelect} researcher={researcher} />
    </React.Fragment>
  )
}
