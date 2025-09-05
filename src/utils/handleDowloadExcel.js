// ExcelJS
import ExcelJS from 'exceljs'

export const handleDownloadExcel = async (cases) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('ResultCases')

  // Si cases tiene datos, agregar los headers y las filas
  if (cases && cases.length > 0) {
    // Obtener las columnas del primer objeto
    const columns = Object.keys(cases[0]).map(key => ({
      header: key,
      key: key,
      width: 15
    }))
    
    worksheet.columns = columns
    
    // Agregar las filas de datos
    cases.forEach(caseData => {
      worksheet.addRow(caseData)
    })
  }

  // Generar el buffer
  const buffer = await workbook.xlsx.writeBuffer()

  const data = new Blob([buffer], {
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
