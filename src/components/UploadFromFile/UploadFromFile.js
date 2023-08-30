import { useState } from 'react'
// Libraries
import { read, utils } from 'xlsx'
import { Button, Box } from '@mui/material'
import Swal from 'sweetalert2'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
// SVG
import UploadSvg from '../../assets/upload.svg'

export default function UploadFromFile() {
  const [xmlsData, setXmlsData] = useState([])

  function handleUploadFile(event) {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      const workbook = read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const processData = utils.sheet_to_json(sheet, { header: 1 })
      setXmlsData(processData)
    }

    reader.readAsBinaryString(file)
  }

  const handleUploadAll = async (xmlsData) => {
    if (xmlsData.length === 0) return alert('No hay datos para cargar')

    try {
      xmlsData.slice(1).forEach(async (agent) => {
        if (agent.length === 0) return

        await setDoc(doc(db, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw'),
          {
            [agent[0].toLowerCase()]: {
              nombre: agent[1].trim(),
              celula: agent[2].trim(),
              proceso: agent[3].trim()
            }
          },
          { merge: true }
        )
      })

      Swal.fire({
        title: 'Realizado!',
        text: 'Todos los agentes han sido agregados',
        icon: 'success',
        confirmButtonText: 'Ok'
      })
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
          IMPORTANTE: Cuando completes los datos es necesario que uses el
          modelo que podrás descargarte a continuación a fin de evitar
          posibles problemas durante la carga. Debido a que las células y
          los nombres de procesos tienen que coincidir con los que se
          encuentran en la base de datos encontrarás que el modelo ya tiene
          algunos datos precargados. y podrás seleccionarlos desde las
          listas desplegables.
        </p>
        <a href='./assets/modelo-nomina.xlsx' download='modelo-nomina.xlsx' className='model'>
          Descargar modelo
        </a>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <th key={rowIndex}>{headerValue}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xmlsData.slice(1).map((agent, rowIndex) => (
                <tr key={rowIndex}>
                  {agent.map((tableValue, columIndex) => (
                    <td key={columIndex}>{tableValue}</td>
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