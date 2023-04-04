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
  } = caso

  return (
    <tr>
      <td>{nombre}</td>
      <td>{numeroCaso}</td>
      <td>{origen}</td>
      <td>{motivoConsulta}</td>
      <td>{proceso}</td>
      <td>{exa}</td>
      <td>{celula}</td>
      <td>{date}</td>
      <td title='Haz click para conocer los detalles del monitoreo'>
        <Link to={`/monitoreo/${id}`}>🗒️</Link>
      </td>
    </tr>
  )
}

export default Case
