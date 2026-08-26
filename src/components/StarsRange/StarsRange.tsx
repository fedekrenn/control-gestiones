// React
import { useState } from 'react'
// Libraries
import { Rating, Typography, Box } from '@mui/material'
// Utils
import { LABELS } from '@/utils/constants'

interface StarsRangeProps {
  question: string
  value: number
  onChange: (value: number) => void
}

export default function StarsRange({ question, value, onChange }: StarsRangeProps) {
  const [hover, setHover] = useState(-1)

  return (
    <li key={question}>
      <Typography component='legend'>{question}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        {value !== null && (
          <Box sx={{ color: 'grey', fontSize: '11px' }}>
            {LABELS[(hover !== -1 ? hover : value) as 1 | 2 | 3 | 4 | 5]}
          </Box>
        )}
        <Rating
          id={`simple-controlled-${question}`}
          name={`simple-controlled-${question}`}
          value={value}
          onChange={e => onChange(parseInt((e.target as HTMLInputElement).value))}
          onChangeActive={(_, newHover) => setHover(newHover)}
          onMouseLeave={() => setHover(-1)}
        />
      </Box>
    </li>
  )
}
