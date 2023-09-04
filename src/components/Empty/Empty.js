// SVG
import EmptySvg from '../../assets/empty.svg'

export default function Empty() {
  return (
    <div className='empty-state'>
      <p>No se encontraron resultados.</p>
      <p>Intenta cambiar los filtros o busca por otro criterio.</p>
      <img src={EmptySvg} alt='empty' />
    </div>
  )
}
