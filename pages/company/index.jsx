import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, Divider, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/router';
import { CompaniesContext } from '@/contexts/company-context';
import useCompaniesDispatch from '@/hooks/useCompaniesDispatch';

export default function Company() {
  const [newCompanyName, setNewCompanyName] = useState('');
  const router = useRouter()

  const { companies, selectedCompany } = React.useContext(CompaniesContext)
  const companiesDispatch = useCompaniesDispatch()

  React.useEffect(() => {
    (async function fetchCompanies() {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies`, {
        method: 'GET',
      })

      const data = await response.json()
      
      companiesDispatch({
        type: 'charged',
        data: {
          companies: data,
        }
      })
    })()
  }, [])

  const handleSelectedCompany = (company) => {
    companiesDispatch({
      type: 'selected',
      data: {
        company
      },
    })
  }

  async function submit() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCompanyName }),
    })

    const data = await response.json()

    setNewCompanyName('');
    companiesDispatch({
      type: 'created',
      data: {
        company: data,
      },
    })

  }

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
          onClick={submit}
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
        <Typography variant="h5">Lista de Empresas</Typography>
        <List>
          {companies.map((company) => (
            <ListItem
              key={company.id}
              button
              onClick={() => handleSelectedCompany(company)}
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
            <Typography variant="h5">Detalhes da Empresa</Typography>
            <Card>
              <CardContent>
                <Typography variant="h6"><b>Nome</b></Typography>
                <Typography>{selectedCompany.name}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography><b>Total de Funcionários:</b> {selectedCompany.total_employees}</Typography>

                <Typography><b>Líderes:</b> {selectedCompany.leaders_count}</Typography>

                <Typography><b>Liderados:</b> {selectedCompany.followers_count}</Typography>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: '#CB90FF',
                    fontWeight: '600',
                    mt: 2
                  }}
                  onClick={() => router.push(`/company/${selectedCompany.id}`)}
                >
                  Ver mais detalhes
                </Button>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
}
