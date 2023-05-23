import { useState } from 'react'
// Librerías
import { read, utils } from 'xlsx'
import { Button, Box } from '@mui/material'
import Swal from 'sweetalert2'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'

const UploadFile = ({ setRefresh, selecManual, setSelecManual }) => {
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

  const handleUploadAll = async () => {
    if (xmlsData.length === 0) return alert('No hay datos para cargar')

    try {
      xmlsData.slice(1).forEach(async (agent) => {
        await setDoc(
          doc(db, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw'),
          {
            [agent[0].toLowerCase()]: {
              nombre: agent[1].trim(),
              celula: agent[2].trim(),
              proceso: agent[3].trim(),
            },
          },
          { merge: true }
        )
      })

      Swal.fire({
        title: 'Realizado!',
        text: 'Todos los agentes han sido agregados',
        icon: 'success',
        confirmButtonText: 'Ok',
      })

      setRefresh(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className='file-upload'>
      <input
        type='radio'
        name='select-type'
        id='type-file'
        onClick={() => setSelecManual(false)}
      />
      <h3>Cargar desde un archivo:</h3>
      {!selecManual && (
        <>
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
            <a
              href='./assets/modelo-nomina.xlsx'
              download='modelo-nomina.xlsx'
              className='model'
            >
              Descargar modelo
            </a>
          </Box>
          <input type='file' accept='.xlsx' onChange={handleUploadFile} />

          {xmlsData.length !== 0 && (
            <>
              <Button
                variant='contained'
                component='label'
                color='error'
                onClick={handleUploadAll}
              >
                Cargar todos
              </Button>
              <table>
                <thead>
                  <tr>
                    {xmlsData[0].map((headerValue, i) => (
                      <th key={i}>{headerValue}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {xmlsData.slice(1).map((agent, rowIndex) => (
                    <tr key={rowIndex}>
                      {agent.map((tableValue, tableIndex) => (
                        <td key={tableIndex}>{tableValue}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </section>
  )
}

export default UploadFile
