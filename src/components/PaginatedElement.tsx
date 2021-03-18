import React, { useState, useEffect } from "react"
import { Grid, TablePagination } from "@material-ui/core"

export default function Pagination({ data, updatePage, ...props }: { data: Array<any>; updatePage: Function }) {
  const [page, setPage] = useState(0)
  const [rowCount, setRowCount] = useState(50)

  useEffect(() => {
    setPage(1)
  }, [data])

  const handleRowChange = (event) => {
    setRowCount(event.target.value)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  useEffect(() => {
    updatePage(page, rowCount)
  }, [page])

  useEffect(() => {
    updatePage(page, rowCount)
  }, [rowCount])

  return (
    <Grid item xs={12}>
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowCount}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleRowChange}
      />
    </Grid>
  )
}
