import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

export default function CaseModal({ open, handleClose, caseDetail }) {
  // const { agentName, caseNumber, agentGroup, comment } = caseDetail

  console.log(caseDetail)

  // const formmatError = (caseDetail, attribute) => caseDetail.ec.motivo === attribute ? 'X' : ''
  // const formmatOm = (caseDetail, attribute) => caseDetail.om.motivo === attribute ? 'X' : ''

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}
      >
        <h2>A desarrollar</h2>
        {/* <table id='send-case'>
          <thead>
            <tr>
              <th colSpan={6}>CALIDAD CEC</th>
            </tr>
            <tr>
              <th colSpan={2}>Asesor</th>
              <th>Caso/Solicitud</th>
              <th>Proceso</th>
              <th colSpan={2}>Célula</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>{nombre}</td>
              <td>{numeroCaso}</td>
              <td>TODO a cambiar</td>
              <td colSpan={2}>{celula}</td>
            </tr>
            <tr>
              <td className='marked' rowSpan='2'>
                EC
              </td>
              <td>Información</td>
              <td>Derivación</td>
              <td>Trato inadecuado</td>
              <td colSpan={2}>Transacciones</td>
            </tr>
            <tr className='data-row'>
              <td>{formmatError(caseDetail, 'información')}</td>
              <td>{formmatError(caseDetail, 'derivaciones')}</td>
              <td>{formmatError(caseDetail, 'trato')}</td>
              <td colSpan={2}>{formmatError(caseDetail, 'transacciones')}</td>
            </tr>
            <tr>
              <td className='marked' rowSpan='2'>Effortless</td>
              <td>Personalización</td>
              <td>Simplicidad</td>
              <td>Uso del Lenguaje</td>
              <td>Posicionamiento</td>
              <td sx={{ width: '150px' }}>Afec al negocio</td>
            </tr>
            <tr className='data-row'>
              <td>{formmatOm(caseDetail, 'personalizacion')}</td>
              <td>{formmatOm(caseDetail, 'simplicidad')}</td>
              <td>{formmatOm(caseDetail, 'lenguaje')}</td>
              <td>{formmatOm(caseDetail, 'posicionamiento')}</td>
              <td>{formmatOm(caseDetail, 'afectacion')}</td>
            </tr>
            <tr>
              <td className='detail' colSpan={6}>{comentarioGestion}</td>
            </tr>
          </tbody>
        </table> */}
      </Box>
    </Modal>
  )
}
