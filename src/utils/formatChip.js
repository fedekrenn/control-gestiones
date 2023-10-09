export const formatChip = (string) => {
  switch (string) {
    case 'No se evalúa':
      return 'default'
    case 'Necesitamos cambiar cosas':
      return 'error'
    case 'Se podría haber hecho mejor':
      return 'warning'
    case 'Buena':
      return 'success'
    case 'Ejemplar':
      return 'success'
    default:
      return 'error'
  }
}
