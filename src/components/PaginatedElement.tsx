import React, { useState, useEffect } from "react"
import { Grid, TablePagination } from "@material-ui/core"
import { useTranslation } from "react-i18next"

export default function Pagination({
  data,
  updatePage,
  rowPerPage,
  defaultCount,
  ...props
}: {
  data: Array<any>
  updatePage: Function
  rowPerPage?: Array<number>
  defaultCount?: number
}) {
  const [page, setPage] = useState(0)
  const [rowCount, setRowCount] = useState(defaultCount ?? 40)
  const { t } = useTranslation()

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
    setPage(0)
    updatePage(0, rowCount)
  }, [rowCount])

  return (
    <Grid item xs={12}>
      <TablePagination
        component="div"
        labelRowsPerPage={t("Rows per page:")}
        count={(data || []).length}
        rowsPerPage={rowCount}
        page={page}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={handleRowChange}
        rowsPerPageOptions={rowPerPage ?? [10, 25, 50, 100]}
      />
    </Grid>
  )
}
