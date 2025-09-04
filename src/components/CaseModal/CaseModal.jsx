// Libraries
import { Modal, Box, Chip } from '@mui/material'
// Utils
import { formatChip } from '../../utils/formatChip'

export default function CaseModal({ open, handleClose, caseDetail }) {
  const { agentGroup, agentName, caseHabilities, caseNumber, comment, perspective } = caseDetail

  const formmatCaseHabilities = (hability) => {
    switch (hability) {
      case 1:
        return 'Completamente ausente'
      case 2:
        return 'Algo ausente'
      case 3:
        return 'Neutro'
      case 4:
        return 'Algo presente'
      case 5:
        return 'Completamente presente'
      default:
        return 'No se evalúa'
    }
  }

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
        <table id='send-case'>
          <thead>
            <tr>
              <th colSpan={5}>Monitoreo asesor</th>
            </tr>
            <tr>
              <th colSpan={2}>Asesor</th>
              <th>Caso/Solicitud</th>
              <th colSpan={2}>Célula</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>{agentName}</td>
              <td>{caseNumber}</td>
              <td colSpan={2}>{agentGroup}</td>
            </tr>
            <tr>
              <th>Detección de la necesidad del cliente</th>
              <th>Pensamiento analítico</th>
              <th>Comunicación efectiva</th>
              <th>Flexibilidad y adaptación</th>
              <th>Capacidad resolutiva</th>
            </tr>
            <tr>
              <td>{formmatCaseHabilities(caseHabilities.customerNeedDetection)}</td>
              <td>{formmatCaseHabilities(caseHabilities.commonSense)}</td>
              <td>{formmatCaseHabilities(caseHabilities.effectiveCommunication)}</td>
              <td>{formmatCaseHabilities(caseHabilities.flexibility)}</td>
              <td>{formmatCaseHabilities(caseHabilities.problemSolving)}</td>
            </tr>
            <tr>
              <th colSpan={2}>Percepción general del caso</th>
              <td colSpan={3} className='perception'>
                <Chip className='chip' label={perspective} color={formatChip(perspective)} />
              </td>
            </tr>
            <tr>
              <td colSpan={5}>{comment}</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Modal>
  )
}
