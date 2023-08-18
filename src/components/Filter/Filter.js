import { useId } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const FilterSelect = ({ label, value, options, onChange, size = 'medium', fWidth = true }) => {
  const labelID = useId()
  const inputID = useId()

  return (
    <FormControl
      fullWidth={fWidth}
      size={size}
      sx={{ textAlign: 'left', minWidth: 120 }}
    >
      <InputLabel htmlFor={inputID} id={labelID}>{label}</InputLabel>
      <Select
        labelId={labelID}
        name={`select-${label.toLowerCase()}`}
        inputProps={{ id: inputID }}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FilterSelect
