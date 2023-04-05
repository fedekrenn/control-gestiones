import { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

const Filter = ({ name, dataValue, changeValue, reset }) => {
  const [value, setValue] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value)
    changeValue(event.target.value)
  }

  useEffect(() => {
    setValue('')
  }, [reset])

  return (
    <FormControl fullWidth sx={{textAlign: 'left'}}>
      <InputLabel id='demo-simple-select-label'>{name}</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={value}
        label={name}
        onChange={handleChange}
      >
        {dataValue.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default Filter
