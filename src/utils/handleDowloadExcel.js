// XLSX
import { utils, write } from 'xlsx'

export const handleDownloadExcel = (cases) => {
  const workbook = utils.book_new()
  const worksheet = utils.json_to_sheet(cases)

  utils.book_append_sheet(workbook, worksheet, 'ResultCases')
  const excelBuffer = write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  })

  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'listado-de-casos.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
