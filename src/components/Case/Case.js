import { Link } from 'react-router-dom'

const Case = ({ caso }) => {
  const {
    id,
    celula,
    date,
    exa,
    motivoConsulta,
    nombre,
    numeroCaso,
    origen,
    proceso,
    puntoATrabajar,
  } = caso

  return (
    <tr>
      <td>{nombre}</td>
      <td>{numeroCaso}</td>
      <td>{origen}</td>
      <td>{motivoConsulta}</td>
      <td>{puntoATrabajar}</td>
      <td>{proceso}</td>
      <td>{exa}</td>
      <td>{celula}</td>
      <td>{date}</td>
      <td title='holaaaa'>
        <Link to={`/monitoreo/${id}`}>🗒️</Link>
      </td>
    </tr>
  )
}

export default Case
