import React from "react"
import { Box, Chip, Tooltip, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
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
      height: "auto",
      minHeight: "32px",
      paddingTop: "5px",
      paddingBottom: "5px",
      "&:focus": { background: "#FFFFFF !important" },
    },
    multiselectPrimary: {
      background: "#ECF4FF !important",
      border: "1px solid #ECF4FF",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 500,
      "&:focus": { background: "#ECF4FF !important" },
    },
    filterChips: {
      flexWrap: "wrap",
      display: "flex",
      justifyContent: "center",
      maxWidth: 1055,
      margin: "15px auto 0",
      width: "100%",
    },
    chiplabel: { whiteSpace: "break-spaces" },
  })
)
export default function MultipleSelect({ ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <Box className={classes.filterChips}>
      {(props.items || []).map((item) => (
        <Tooltip
          key={item}
          style={{ margin: 4 }}
          disableHoverListener={!props.tooltips}
          title={(props.tooltips || {})[item] || props.defaultTooltip || item}
        >
          <Chip
            classes={{ root: classes.multiselect, colorPrimary: classes.multiselectPrimary, label: classes.chiplabel }}
            label={
              <section>
                {t(item)}
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
