import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

const CaseModal = ({ open, handleClose, caseDetail }) => {
  const { nombre, numeroCaso, proceso, celula, comentarioGestion } = caseDetail

  const hasInfoError = (caseDetail) => caseDetail.ec.motivo === 'información' ? 'X' : ''
  const hasTransError = (caseDetail) => caseDetail.ec.motivo === 'transacciones' ? 'X' : ''
  const hasDerivError = (caseDetail) => caseDetail.ec.motivo === 'derivaciones' ? 'X' : ''
  const hasTratoError = (caseDetail) => caseDetail.ec.motivo === 'trato' ? 'X' : ''

  const hasAfectOmision = (caseDetail) => caseDetail.om.motivo === 'afectacion' ? 'X' : ''
  const hasLenguajeOmision = (caseDetail) => caseDetail.om.motivo === 'lenguaje' ? 'X' : ''
  const hasPersOmision = (caseDetail) => caseDetail.om.motivo === 'personalizacion' ? 'X' : ''
  const hasPosicionOmision = (caseDetail) => caseDetail.om.motivo === 'posicionamiento' ? 'X' : ''
  const hasSimplicidadOmision = (caseDetail) => caseDetail.om.motivo === 'simplicidad' ? 'X' : ''


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
          p: 4,
        }}
      >
        <table id='send-case'>
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
              <td>{proceso}</td>
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
              <td>{hasInfoError(caseDetail)}</td>
              <td>{hasDerivError(caseDetail)}</td>
              <td>{hasTratoError(caseDetail)}</td>
              <td colSpan={2}>{hasTransError(caseDetail)}</td>
            </tr>
            <tr>
              <td className='marked' rowSpan='2'>
                Effortless
              </td>
              <td>Personalización</td>
              <td>Simplicidad</td>
              <td>Uso del Lenguaje</td>
              <td>Posicionamiento</td>
              <td style={{ width: '150px' }}>Afec al negocio</td>
            </tr>
            <tr className='data-row'>
              <td>{hasPersOmision(caseDetail)}</td>
              <td>{hasSimplicidadOmision(caseDetail)}</td>
              <td>{hasLenguajeOmision(caseDetail)}</td>
              <td>{hasPosicionOmision(caseDetail)}</td>
              <td>{hasAfectOmision(caseDetail)}</td>
            </tr>
            <tr>
              <td className='detail' colSpan={6}>
                {comentarioGestion}
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Modal>
  )
}

export default CaseModal
