// Core Imports
import React from "react"
import { Box, Chip, Tooltip, Badge } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"

// TODO: Change the items prop to: { name: string; selected: bool; badge: string; tooltip: string; }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badgeCount: {
      color: "#6083E7",
      paddingLeft: 10,
    },
    multiselect: {
      border: "1px solid #C6C6C6",
      background: "#FFFFFF",
      color: "rgba(0, 0, 0, 0.4)",
      "&:focus": { background: "#FFFFFF !important" },
    },
    multiselectPrimary: {
      background: "#ECF4FF !important",
      border: 0,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 500,
      "&:focus": { background: "#ECF4FF !important" },
    },
  })
)

export default function MultipleSelect({ ...props }) {
  const classes = useStyles()
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
          <Chip
            classes={{ root: classes.multiselect, colorPrimary: classes.multiselectPrimary }}
            label={
              <section>
                {item}
                <span className={classes.badgeCount}>{(props.badges || {})[item] || props.defaultBadge || 0}</span>
              </section>
            }
            color={(props.selected || []).indexOf(item) >= 0 ? "primary" : undefined}
            onClick={
              (props.selected || []).indexOf(item) >= 0
                ? () => props.onChange((props.selected || []).filter((x) => x !== item))
                : () => props.onChange(!!props.singleSelect ? [item] : [...(props.selected || []), item])
            }
          />
        </Tooltip>
      ))}
    </Box>
  )
}
