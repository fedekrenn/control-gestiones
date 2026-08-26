import { Link } from 'react-router-dom'
import FeedIcon from '@mui/icons-material/Feed'
// Config
import { caseDetailPath, employeePath } from '@/config/routes'
// Types
import type { Case } from '@/types/case'

interface InteractionCaseProps {
  caseData: Case
}

export default function InteractionCase({ caseData }: InteractionCaseProps) {
  const {
    id,
    agentId,
    agentGroup,
    agentName,
    date,
    contactReason,
    caseNumber,
    origin,
    perspective
  } = caseData

  return (
    <tr>
      <td>
        <Link to={employeePath(agentId)}>
          {agentId.toUpperCase()}
        </Link>
      </td>
      <td>{agentName}</td>
      <td>{caseNumber}</td>
      <td>{origin}</td>
      <td>{contactReason}</td>
      <td>{agentGroup}</td>
      <td>{date}</td>
      <td>{perspective}</td>
      <td className='table-icon' title='Haz click para conocer los detalles del monitoreo'>
        <Link to={caseDetailPath(id)}>
          <FeedIcon color='primary' fontSize='large' />
        </Link>
      </td>
    </tr>
  )
}
