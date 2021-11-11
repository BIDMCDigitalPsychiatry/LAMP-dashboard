import React, { useState, useEffect } from "react"
import { Grid, TablePagination } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { colorSignalConfig } from "vega-lite/build/src/config"

export default function Pagination({
  data,
  updatePage,
  rowPerPage,
  defaultCount,
  currentPage,
  currentRowCount,
  type,
  ...props
}: {
  data: Array<any>
  updatePage: Function
  rowPerPage?: Array<number>
  defaultCount?: number
  currentPage?: number
  currentRowCount?: number
  type?: number
}) {
  const [page, setPage] = useState(currentPage)
  const [rowCount, setRowCount] = useState(currentRowCount ?? defaultCount ?? (type ? 10 : 40))
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
    setPage(page)
    updatePage(page, rowCount)
  }, [rowCount])

  useEffect(() => {
    setPage(currentPage ?? 0)
  }, [currentPage])

  useEffect(() => {
    setRowCount(currentRowCount ?? (type ? 10 : 40))
  }, [currentRowCount])

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
