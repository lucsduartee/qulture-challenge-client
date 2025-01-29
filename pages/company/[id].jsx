import * as React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, Avatar, Grid, Button } from '@mui/material';
import { CompaniesContext } from '@/contexts/company-context';
import useCompaniesDispatch from '@/hooks/useCompaniesDispatch';
import { useRouter } from 'next/router';

export default function CompanyDetails() {
  const [employees, setEmployees] = React.useState([])
  const [employee, setEmployee] = React.useState()
  const [peers, setPeers] = React.useState([])
  const [subordinates, setSubordinates] = React.useState([])
  const [deepSubordinates, setDeepSubordinates] = React.useState([])

  const router = useRouter()

  const { selectedCompany } = React.useContext(CompaniesContext)
  const companiesDispatch = useCompaniesDispatch()

  React.useEffect(() => {
    if (!router.query.id) return

    (async function fetchCompanyAndEmployees() {
      const companyId = router.query.id;

      const [companyResponse, employeesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies/${companyId}`, {
          method: 'GET',
        }),
        fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies/${companyId}/employees`, {
          method: 'GET',
        })
      ]);

      const companyData = await companyResponse.json();
      const employeesData = await employeesResponse.json();
      setEmployees(employeesData)

      companiesDispatch({
        type: 'selected',
        data: {
          company: companyData,
        }
      });
    })();
  }, [router.query.id])

  const handleDeleteEmployee = async (employeeId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/employees/${employeeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Colaborador deletado com sucesso!');
      router.reload();
    } else {
      alert('Erro ao deletar colaborador.');
    }
  };

  const handleViewMoreAboutEmployee = async (employee) => {
    (async function fetchEmployeesInfos() {
      const [peersResponse, subordinatesResponse, deepSubordinatesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/employees/${employee.id}/peers`, {
          method: 'GET',
        }),
        fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/employees/${employee.id}/subordinates`, {
          method: 'GET',
        }),
        fetch(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/employees/${employee.id}/deep_subordinates`, {
          method: 'GET',
        })
      ]);

      const peersData = await peersResponse.json()
      const subordinatesData = await subordinatesResponse.json()
      const deepSubordinatesData = await deepSubordinatesResponse.json()

      setPeers(peersData)
      setSubordinates(subordinatesData)
      setDeepSubordinates(deepSubordinatesData)
      setEmployee(employee)
    })();
  }

  const getManager = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employees.find(emp => emp.id === employee?.manager_id) || null;
  };

  return (
    selectedCompany &&
    (<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Typography variant="h5">{selectedCompany.name}</Typography>
      <Box>
        <Typography><b>Total de Colaboradores:</b> {selectedCompany.total_employees}</Typography>
        <Typography><b>Líderes:</b> {selectedCompany.leaders_count}</Typography>
        <Typography><b>Liderados:</b> {selectedCompany.followers_count}</Typography>
      </Box>

      <Box>
        <Typography variant="h6">Lista de Colaboradores</Typography>
        <Grid container spacing={2}>
          {employees.map(employee => (
            <Grid item xs={12} sm={6} md={4} key={employee.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <Avatar src={employee.picture} sx={{ width: 100, height: 100, mb: 2 }} />
                <CardContent>
                  <Typography variant="h6" align="center">{employee.name}</Typography>
                  <Typography variant="body2" color="textSecondary" align="center">{employee.email}</Typography>
                  <Button
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Deletar Colaborador
                  </Button>
                  <Button
                    sx={{ mt: 2, ml: 2, color: '#CB90FF' }}
                    onClick={() => handleViewMoreAboutEmployee(employee)}
                  >
                    Ver mais detalhes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {
        employee && (
          <Box>
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{employee.name}</Typography>
                  {subordinates.length !== 0 && <>
                    <Typography><b>Liderados Diretos:</b></Typography>
                    <Box>
                      <List>
                        {subordinates?.map(subordinate => (
                          <ListItem key={subordinate.id} sx={{ border: '1px solid #ddd', borderRadius: 2, mb: 1 }}>{subordinate.name}</ListItem>
                        ))}
                      </List>
                    </Box></>
                  }
                  {
                    deepSubordinates.length !== 0 && <>
                      <Typography><b>Liderados de Segundo Nível:</b></Typography>
                      <Box>
                        <List>
                          {deepSubordinates.map(secondLevel => {
                            const secondLevelManager = getManager(secondLevel.id);
                            return (
                              <ListItem key={secondLevel.id} sx={{ border: '1px solid #ddd', borderRadius: 2, mb: 1 }}>
                                {secondLevel.name} (Manager: {secondLevelManager?.name || 'N/A'})
                              </ListItem>
                            );
                          })}
                        </List>
                      </Box>
                    </>
                  }
                </CardContent>
              </Card>
            </Box>

            {
              peers.length !== 0 && <Box>
                <Typography variant="h6">Pares do Colaborador</Typography>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{employee.name}</Typography>
                    <Typography><b>Pares:</b></Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {peers.map(peer => (
                        <Box key={peer.id} sx={{ border: '1px solid #ddd', borderRadius: 2, p: 1, width: '100%' }}>
                          {peer.name}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            }
          </Box>
        )
      }
    </Box>)
  );
}
