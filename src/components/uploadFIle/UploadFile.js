import { read, utils } from 'xlsx'
import { useState } from 'react'

const UploadFile = () => {
  const [xmlsData, setXmlsData] = useState([])

  function handleArchivoCambiado(event) {

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

  return (
    <div>
      <input type='file' onChange={handleArchivoCambiado} />
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
