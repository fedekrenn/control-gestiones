import notFound from '../../assets/404.svg'

export default function NotFound() {
  return (
    <main className='not-found'>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <img src={notFound} alt='404' />
    </main>
  )
}
