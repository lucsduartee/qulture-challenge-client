import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, Divider, Card, CardContent } from '@mui/material';

export default function Company() {
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Company 1' },
    { id: 2, name: 'Company 2' },
    { id: 3, name: 'Company 3' }
  ]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleAddCompany = () => {
    if (newCompanyName.trim() === '') return;
    const newCompany = { id: companies.length + 1, name: newCompanyName };
    setCompanies([...companies, newCompany]);
    setNewCompanyName('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom>Cadastrar Empresa</Typography>
        <TextField
          label="Nome da Empresa"
          variant="outlined"
          fullWidth
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAddCompany}
          sx={{
            backgroundColor: '#CB90FF',
            fontWeight: '600'
          }}
        >
          Cadastrar
        </Button>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h5" gutterBottom>Lista de Empresas</Typography>
        <List>
          {companies.map((company) => (
            <ListItem
              key={company.id}
              button
              onClick={() => setSelectedCompany(company)}
              sx={{ mb: 1, border: '1px solid #ddd', borderRadius: 2 }}
            >
              {company.name}
            </ListItem>
          ))}
        </List>
      </Box>

      {selectedCompany && (

        <>
          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom>Detalhes da Empresa</Typography>
            <Card>
              <CardContent>
                <Typography variant="h6">Nome:</Typography>
                <Typography>{selectedCompany.name}</Typography>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
}
