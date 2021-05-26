import React from "react"
import { Button, ButtonGroup } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { evalFunc } from "../../../../helpers"

const colorDefault = ({ type, k }) => (type === k ? "primary" : "default")

export default function QuestionButtons({ type, onClick }) {
  const { t } = useTranslation()
  const buttons = [
    { label: "Question Type", disabled: true },
    { label: "text" },
    { label: "boolean" },
    { label: "list", color: ["list", "select"].includes(type) ? "primary" : "default" },
    { label: "multi-select", key: "multiselect" },
    { label: "Slider", key: "slider" },
    { label: "Short Answer", key: "short" },
    { label: "Rating", key: "rating" },
  ]

  return (
    <ButtonGroup size="small">
      {buttons.map(({ label, disabled = undefined, key, color = colorDefault }) => {
        const k = key ?? label
        return (
          <Button
            key={k}
            disabled={disabled}
            color={evalFunc(color, { k, type })}
            onClick={!disabled && onClick && onClick("type", k)}
          >
            {t(label)}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
