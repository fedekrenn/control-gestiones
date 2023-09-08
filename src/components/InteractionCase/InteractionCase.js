import { Link } from 'react-router-dom'
import FeedIcon from '@mui/icons-material/Feed'

export default function InteractionCase({ caseData }) {
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
      <td>{agentId.toUpperCase()}</td>
      <td>{agentName}</td>
      <td>{caseNumber}</td>
      <td>{origin}</td>
      <td>{contactReason}</td>
      <td>{agentGroup}</td>
      <td>{date}</td>
      <td>{perspective}</td>
      <td className='table-icon' title='Haz click para conocer los detalles del monitoreo'>
        <Link to={`/monitoreo/${id}`}>
          <FeedIcon color='primary' fontSize='large' />
        </Link>
      </td>
    </tr>
  )
}
