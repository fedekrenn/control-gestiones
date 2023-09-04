// SVG
import ErrorSvg from '../../assets/error.svg'
export default function Error({ message }) {
  console.log(message)

  return (
    <div className='empty-state error'>
      <p>Upps! Algo sucedió al cargar los datos.</p>
      <p className='detail'>{message}</p>
      <img src={ErrorSvg} alt='Imagen de error' />
    </div>
  )
}
