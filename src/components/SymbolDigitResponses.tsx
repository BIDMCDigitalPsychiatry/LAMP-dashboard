import React, { useEffect, useState } from "react"
import { makeStyles, Theme, createStyles, TableCell, Table, TableRow, TableHead, TableBody } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import Pagination from "./PaginatedElement"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    tablestyle: {
      "& th": {
        background: "#f4f4f4",
        padding: "6px !important",
      },
      "& td": {
        borderBottom: "#e3e3e3 solid 1px",
        padding: "6px !important",
      },
      "& td:not(:first-child)": {
        textAlign: "center",
      },
    },
  })
)

export const getDateStringValue = (timestamp) => {
  let date = new Date(parseInt(timestamp))
  var curr_date = date.getDate().toString().padStart(2, "0")
  var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
  var curr_year = date.getFullYear()
  var curr_hr = date.getHours()
  var curr_min = date.getMinutes()
  let dateString = curr_month + "-" + curr_date + "-" + curr_year + "-" + curr_hr + "-" + curr_min
  return (
    getDateVal(dateString).toLocaleDateString([]) +
    " " +
    getDateVal(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  )
}

export const getDateVal = (dateVal) => {
  let date = dateVal.split("-")
  const newDate = new Date()
  newDate.setFullYear(date[2])
  newDate.setMonth(parseInt(date[0]) - 1)
  newDate.setDate(parseInt(date[1]))
  newDate.setHours(parseInt(date[3]))
  newDate.setMinutes(parseInt(date[4]))
  return newDate
}

export default function SymbolDigitResponses({ activityData, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [rowCount, setRowCount] = useState(10)
  const [paginated, setPaginated] = useState(activityData.slice(page * rowCount, page * rowCount + rowCount))

  const handleChangePage = (page: number, rowCount: number) => {
    setPage(page)
    setRowCount(rowCount)
    setPaginated(activityData.slice(page * rowCount, page * rowCount + rowCount))
  }

  return (
    <div className={classes.root}>
      <Table className={classes.tablestyle}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Number of symbols</TableCell>
            <TableCell>Number of correct responses</TableCell>
            <TableCell>Number of incorrect responses</TableCell>
            <TableCell>Average response time (correct)</TableCell>
            <TableCell>Average response time (incorrect)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activityData.length > 0 ? (
            paginated.map((event) => (
              <TableRow>
                <TableCell>{getDateStringValue(event?.timestamp)}</TableCell>
                <TableCell>{event?.static_data?.number_of_responses}</TableCell>
                <TableCell>{event?.static_data?.number_of_correct_responses}</TableCell>
                <TableCell>{event?.static_data?.number_of_incorrect_responses}</TableCell>
                <TableCell>{event?.static_data?.avg_correct_response_time}</TableCell>
                <TableCell>{event?.static_data?.avg_incorrect_response_time}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>{`${t("No records found")}`}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination data={activityData} updatePage={handleChangePage} rowPerPage={[10, 20, 50, 100]} />
    </div>
  )
}
