import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const FilterSelect = ({ label, value, options, onChange }) => {
  return (
    <FormControl fullWidth sx={{ textAlign: 'left' }}>
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${label}`}
        id={`select-${label}`}
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
