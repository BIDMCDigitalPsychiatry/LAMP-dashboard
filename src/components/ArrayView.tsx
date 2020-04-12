// Core Imports
import React from "react"
import { Table, TableBody, TableHead, TableCell, TableRow } from "@material-ui/core"

// Expects a homogenous array (!!) and produces a Table.
export default function ArrayView({ ...props }) {
  // Convert underscore case into human-readable strings.
  const humanize = (str) => str.replace(/(^|_)(\w)/g, ($0, $1, $2) => ($1 && " ") + $2.toUpperCase())

  // Get all the keys we'll be displaying from the array.
  const displayKeys = () => Object.keys(props.value[0] || {}).filter((x) => !(props.hiddenKeys || []).includes(x))

  return (
    <div style={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            {displayKeys().map((key) => (
              <TableCell key={key} style={{ borderBottom: 0 }} title={humanize(key)}>
                {humanize(key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.value.map((row, index) => (
            <React.Fragment>
              <TableRow hover key={index}>
                {displayKeys().map((key) =>
                  Array.isArray(row[key]) ? (
                    <ArrayView value={row[key]} />
                  ) : !!row[key] && typeof row[key] === "object" ? (
                    <ArrayView value={[row[key]]} />
                  ) : (
                    <TableCell key={row[key]} style={{ borderBottom: 0 }}>
                      {row[key]}
                    </TableCell>
                  )
                )}
              </TableRow>
              {!!props.hasSpanningRowForIndex && !!props.spanningRowForIndex && props.hasSpanningRowForIndex(index) && (
                <TableRow key={`${index}-optional`}>
                  <TableCell colSpan={displayKeys().length}>{props.spanningRowForIndex(index)}</TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
