import React from "react"
// Components
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableHead from "@material-ui/core/TableHead"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
// Styles
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { humanize } from "./Utils"

import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      "& tr": {
        "& td": {
          "&:first-child": {
            position: "sticky",
            left: 0,
            background: "#fff",
          },
        },
        "& th": {
          "&:first-child": {
            position: "sticky",
            left: 0,
            background: "#fff",
          },
        },
      },
    },
  })
)

export default function ArrayView({
  value,
  hiddenKeys,
  hasSpanningRowForIndex,
  spanningRowForIndex,
  ...props
}: {
  value: any[]
  hiddenKeys?: string[]
  hasSpanningRowForIndex?: (index: number) => boolean
  spanningRowForIndex?: (index: number) => any
}) {
  const { t } = useTranslation()
  const displayKeys = () => Object.keys(value[0] || {}).filter((x) => !(hiddenKeys || []).includes(x))
  const classes = useStyles()
  return (
    <div style={{ overflowX: "auto" }}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {displayKeys().map((key) => (
              <TableCell key={key} title={humanize(key)}>
                {humanize(key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {value.map((row, index) => (
            <React.Fragment>
              <TableRow hover key={index}>
                {displayKeys().map((key) =>
                  Array.isArray(row[key]) ? (
                    <ArrayView value={row[key]} />
                  ) : !!row[key] && typeof row[key] === "object" ? (
                    <ArrayView value={[row[key]]} />
                  ) : (
                    <TableCell key={row[key]}>
                      {typeof row[key] === "string" ? (
                        <ReactMarkdown children={t(row[key])} skipHtml={false} remarkPlugins={[gfm, emoji]} />
                      ) : (
                        row[key]?.toString()
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
              {hasSpanningRowForIndex?.(index) && (
                <TableRow key={`${index}-optional`}>
                  <TableCell colSpan={displayKeys().length}>{spanningRowForIndex?.(row.item)}</TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
