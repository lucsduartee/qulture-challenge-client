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
import { useRouter } from 'next/router';

export default function Employees() {
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', picture: '', companyId: '' });
  const [selectedCompany, setSelectedCompany] = useState('');

  const router = useRouter()

  React.useEffect(() => {
    (async function fetchCompanyAndEmployees() {

      const companiesResponse = await fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies`, {
        method: 'GET',
      })

      const companyData = await companiesResponse.json();
      setCompanies(companyData)
    })();
  }, [])

  const handleAddEmployee = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies/${newEmployee.companyId}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newEmployee.name,
        email: newEmployee.email,
        picture: newEmployee.picture
      }),
    })

    setNewEmployee({ name: '', email: '', picture: '', companyId: '' });
  };

  const handleSelectCompany = async (e) => {
    setSelectedCompany(e.target.value);

    const employeesResponse = await fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies/${e.target.value}/employees`, {
      method: 'GET',
    })

    const employeesData = await employeesResponse.json();
    setEmployees(employeesData)
  }

  const handleAssignLeader = (employeeId, leaderId) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === employeeId ? { ...emp, leaderId } : emp
      )
    );
  };

  const handlePromoteLeader = async (employeeId, leaderId) => {
    if (!leaderId) {
      alert("Por favor, selecione um líder válido.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/employees/${leaderId}/promote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employee_id: employeeId }),
    });

    if (response.ok) {
      alert("Líder atribuído com sucesso!");
      router.reload();
    } else {
      alert("Falha ao promover o líder.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom>Cadastro</Typography>
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
          <InputLabel id="company-label">Empresa</InputLabel>
          <Select
            labelId="company-label"
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

      <Box>
        <Typography variant="h6">Ver Colaboradores por Empresa</Typography>

        <FormControl fullWidth sx={{ mt: 4 }}>
          <Select
            value={selectedCompany}
            onChange={(e) => handleSelectCompany(e)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Selecione uma Empresa</em>
            </MenuItem>
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {employees.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Colaboradores da {companies.find(c => c.id === Number(selectedCompany))?.name}</Typography>
          {employees.map(employee => (
            <Box key={employee.id} sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1"><strong>Nome:</strong> {employee.name}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {employee.email}</Typography>
                {employee.manager_id && (
                  <Typography variant="body1"><strong>Líder:</strong> {employees.find(e => e.id === employee.manager_id)?.name}</Typography>
                )}
              </Box>
              {!employee.manager_id && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl sx={{ minWidth: 150 }} size="small">
                    <InputLabel>Selecione um líder</InputLabel>
                    <Select
                      value={employee.leaderId || ''}
                      onChange={(e) => handleAssignLeader(employee.id, e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Nenhum</em>
                      </MenuItem>
                      {employees.filter(e => e.id !== employee.id).map(potentialLeader => (
                        <MenuItem key={potentialLeader.id} value={potentialLeader.id}>{potentialLeader.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={() => handlePromoteLeader(employee.id, employee.leaderId)}
                    sx={{
                      color: '#CB90FF',
                      border: '1px solid #CB90FF'
                    }}
                  >
                    Confirmar líder
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography sx={{ mt: 4 }}>Nenhum funcionário cadastrado para esta empresa.</Typography>
      )}
    </Box>
  );
}