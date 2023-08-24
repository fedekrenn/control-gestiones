export default function Error({ message }) {
  console.log(message)

  return (
    <div>
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  )
}
