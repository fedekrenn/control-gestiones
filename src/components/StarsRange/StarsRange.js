import { Rating, Typography } from '@mui/material'

export default function StarsRange({ question, value, onChange }) {
  return (
    <li key={question}>
      <Typography component="legend">{question}</Typography>
      <Rating
        id={`simple-controlled-${question}`}
        name={`simple-controlled-${question}`}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
      />
    </li>
  )
}
