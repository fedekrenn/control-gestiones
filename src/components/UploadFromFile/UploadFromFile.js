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

    let count = 0
    let error = false
    const buffer = []

    try {
      xmlsData.slice(1).forEach(async (agent) => {
        if (agent.length === 0) return

        const regex = /^ex[a-zA-Z]\d+$/i

        if (!regex.test(agent[0])) {
          error = true
          buffer.push(agent[0])
          return
        }

        count++
        await setDoc(doc(db, 'agentsList', 'JUYcFTPxnTi8vQwCMoJC'),
          {
            [agent[0].toLowerCase()]: {
              name: agent[1].trim(),
              cell: agent[2].trim()
            }
          },
          { merge: true }
        )
      })

      if (error) {
        return Swal.fire({
          title: 'Atención!',
          html: `Uno o más EXA ingresados no son válidos, revisa los siguientes EXA:<br><br>
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
