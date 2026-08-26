import { useState, type ChangeEvent } from 'react'
// Libraries
import ExcelJS, { type CellValue } from 'exceljs'
import { Button, Box } from '@mui/material'
import Swal from 'sweetalert2'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'
// SVG
import UploadSvg from '@/assets/upload.svg'

export default function UploadFromFile() {
  const [xmlsData, setXmlsData] = useState<CellValue[][]>([])

  async function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(await file.arrayBuffer())

      // Obtener la primera hoja
      const worksheet = workbook.worksheets[0]
      const processData: CellValue[][] = []

      // Convertir cada fila a array
      worksheet.eachRow((row) => {
        const rowData: CellValue[] = []
        row.eachCell((cell) => {
          rowData.push(cell.value)
        })
        processData.push(rowData)
      })

      setXmlsData(processData)
    } catch (error) {
      console.error('Error al leer el archivo:', error)
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo leer el archivo. Asegúrate de que sea un archivo Excel válido.',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  const handleUploadAll = async (xmlsData: CellValue[][]) => {
    if (xmlsData.length === 0) return alert('No hay datos para cargar')

    let count = 0
    let error = false
    const buffer: string[] = []

    try {
      xmlsData.slice(1).forEach(async (agent) => {
        if (agent.length === 0) return

        const regex = /^ex[a-zA-Z]\d+$/i
        const legajo = String(agent[0])

        if (!regex.test(legajo)) {
          error = true
          buffer.push(legajo)
          return
        }

        count++
        await setDoc(doc(db, 'agentsList', 'JUYcFTPxnTi8vQwCMoJC'),
          {
            [legajo.toLowerCase()]: {
              name: String(agent[1]).trim(),
              cell: String(agent[2]).trim()
            }
          },
          { merge: true }
        )
      })

      if (error) {
        return Swal.fire({
          title: 'Atención!',
          html: `Uno o más legajos de asesores ingresados no son válidos, revisa los siguientes:<br><br>
           ${buffer.join('<br> ')}<br><br>
           ${count > 0 ? `Los demás ${count} agentes han sido agregados correctamente` : ''}`,
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
      } else {
        Swal.fire({
          title: 'Realizado!',
          text: 'Todos los agentes han sido agregados',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: 'Error!',
        text: 'No se ha podido agregar a los agentes',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  return (
    <section className='file-upload'>
      <Box>
        <p>
          <span className='alert'>IMPORTANTE:</span> Cuando completes los datos es necesario que uses el modelo
          que podrás descargarte a continuación, esto a fin de evitar posibles problemas
          durante la carga. Los nombres de las células tienen que coincidir de manera exacta
          con los que se encuentran en la base de datos. Encontrarás que el modelo ya tiene
          algunos datos precargados y podrás seleccionarlos desde las listas desplegables.
        </p>
        <a href='./assets/modelo-nomina.xlsx' download='modelo-nomina.xlsx' className='model'>
          Descargar modelo
        </a>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column' }, alignItems: 'center', justifyContent: 'center' }}>
          <img src={UploadSvg} alt='Subir archivo' />
          <input type='file' accept='.xlsx' onChange={handleUploadFile} />
        </Box>
      </Box>

      {xmlsData.length !== 0 && (
        <>
          <Button
            variant='contained'
            component='label'
            color='error'
            onClick={() => handleUploadAll(xmlsData)}
          >
            Cargar todos
          </Button>
          <table>
            <thead>
              <tr>
                {xmlsData[0].map((headerValue, rowIndex) => (
                  <th key={rowIndex}>{String(headerValue)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xmlsData.slice(1).map((agent, rowIndex) => (
                <tr key={rowIndex}>
                  {agent.map((tableValue, columIndex) => (
                    <td key={columIndex}>{String(tableValue)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}
