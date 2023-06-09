import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

const CaseModal = ({ open, handleClose }) => {
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
              <td colSpan={2}>Miranda Silvana</td>
              <td>543357535</td>
              <td>CD Ar</td>
              <td colSpan={2}>Célula 611</td>
            </tr>
            <tr>
              <td className='marked' rowspan='2'>
                EC
              </td>
              <td>Información</td>
              <td>Derivación</td>
              <td>Trato inadecuado</td>
              <td colSpan={2}>Transacciones</td>
            </tr>
            <tr>
              <td>TODO</td>
              <td>TODO</td>
              <td>TODO</td>
              <td colSpan={2}>TODO</td>
            </tr>
            <tr>
              <td className='marked' rowspan='2'>
                Effortless
              </td>
              <td>Personalización</td>
              <td>Simplicidad</td>
              <td>Uso del Lenguaje</td>
              <td>Posicionamiento</td>
              <td style={{ width: '150px' }}>Afec al negocio</td>
            </tr>
            <tr>
              <td>TODO</td>
              <td>TODO</td>
              <td>TODO</td>
              <td>TODO</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td colSpan={6}>TODO</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Modal>
  )
}

export default CaseModal
