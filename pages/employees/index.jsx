import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

export default function Employees() {
  const [companies] = useState([
    { id: 1, name: 'Company 1' },
    { id: 2, name: 'Company 2' },
    { id: 3, name: 'Company 3' }
  ]);

  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', picture: '', companyId: '' });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.picture || !newEmployee.companyId) return;
    const newEntry = { id: employees.length + 1, ...newEmployee };
    setEmployees([...employees, newEntry]);
    setNewEmployee({ name: '', email: '', picture: '', companyId: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom>Cadastrar Colaborador</Typography>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="URL da Foto"
          variant="outlined"
          fullWidth
          value={newEmployee.picture}
          onChange={(e) => setNewEmployee({ ...newEmployee, picture: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Empresa</InputLabel>
          <Select
            value={newEmployee.companyId}
            onChange={(e) => setNewEmployee({ ...newEmployee, companyId: e.target.value })}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#CB90FF',
            fontWeight: '600'
          }}
          onClick={handleAddEmployee}
        >Cadastrar Colaborador</Button>
      </Box>
    </Box>
  );
}