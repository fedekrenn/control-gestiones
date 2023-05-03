import { read, utils } from 'xlsx'
import { useState } from 'react'
import { Button } from '@mui/material'
import Swal from 'sweetalert2'
import { doc, setDoc } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'

const UploadFile = ({ setRefresh }) => {
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
            [agent[0]]: {
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
    <div className='file-upload'>
      <h2>O puedes cargarlo desde un archivo:</h2>
      <input type='file' accept='.xlsx' onChange={handleUploadFile} />
      <Button variant='contained' component='label' onClick={handleUploadAll}>
        Cargar todos
      </Button>
      {xmlsData.length !== 0 && (
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
      )}
    </div>
  )
}

export default UploadFile
