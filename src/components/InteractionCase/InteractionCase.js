import { Link } from 'react-router-dom'
import FeedIcon from '@mui/icons-material/Feed'

export default function InteractionCase({ clientInteraction }) {
  const {
    id,
    celula,
    date,
    exa,
    motivoConsulta,
    nombre,
    numeroCaso,
    origen
  } = clientInteraction

  return (
    <tr>
      <td>{nombre}</td>
      <td>{numeroCaso}</td>
      <td>{origen}</td>
      <td>{motivoConsulta}</td>
      <td>{exa.toUpperCase()}</td>
      <td>{celula}</td>
      <td>{date}</td>
      <td className='table-icon' title='Haz click para conocer los detalles del monitoreo'>
        <Link to={`/monitoreo/${id}`}>
          <FeedIcon color='primary' fontSize='large' />
        </Link>
      </td>
    </tr>
  )
}
