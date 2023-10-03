import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

export default function CaseModal({ open, handleClose, caseDetail }) {
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
      </Box>
    </Modal>
  )
}
