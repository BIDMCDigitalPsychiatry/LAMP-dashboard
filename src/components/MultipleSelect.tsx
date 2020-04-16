// Core Imports
import React from "react"
import { Chip, Tooltip, Badge } from "@material-ui/core"

// TODO: Change the items prop to: { name: string; selected: bool; badge: string; tooltip: string; }

export default function MultipleSelect({ ...props }) {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {(props.items || []).map((item) => (
        <Tooltip
          key={item}
          style={{ margin: 4 }}
          disableHoverListener={!props.tooltips}
          title={(props.tooltips || {})[item] || props.defaultTooltip || item}
        >
          <Badge
            showZero={props.showZeroBadges}
            badgeContent={(props.badges || {})[item] || props.defaultBadge || 0}
            color="primary"
          >
            <Chip
              label={item}
              color={(props.selected || []).indexOf(item) >= 0 ? "primary" : undefined}
              onClick={
                (props.selected || []).indexOf(item) >= 0
                  ? () => {}
                  : () => props.onChange(!!props.singleSelect ? [item] : [...(props.selected || []), item])
              }
              onDelete={
                (props.selected || []).indexOf(item) < 0
                  ? undefined
                  : () => props.onChange((props.selected || []).filter((x) => x !== item))
              }
            />
          </Badge>
        </Tooltip>
      ))}
    </Box>
  )
}
