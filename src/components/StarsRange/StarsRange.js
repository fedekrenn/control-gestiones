import { useState } from 'react'
import { Rating, Typography, Box } from '@mui/material'

const labels = {
  1: 'Completamente ausente',
  2: 'Algo ausente',
  3: 'Neutro (ni presente ni ausente)',
  4: 'Algo presente',
  5: 'Completamente presente'
}

export default function StarsRange({ question, value, onChange }) {
  const [hover, setHover] = useState(-1)

  return (
    <li key={question}>
      <Typography component='legend'>{question}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        {value !== null && (
          <Box sx={{ color: 'grey', fontSize: '11px' }}>
            {labels[hover !== -1 ? hover : value]}
          </Box>
        )}
        <Rating
          id={`simple-controlled-${question}`}
          name={`simple-controlled-${question}`}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          onChangeActive={(_, newHover) => setHover(newHover)}
          onMouseLeave={() => setHover(-1)}
        />
      </Box>
    </li>
  )
}
