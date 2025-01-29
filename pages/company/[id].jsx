import * as React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, Avatar, Grid } from '@mui/material';
import { CompaniesContext } from '@/contexts/company-context';
import useCompaniesDispatch from '@/hooks/useCompaniesDispatch';
import { useRouter } from 'next/router';

export default function CompanyDetails() {
  const [employees, setEmployees] = React.useState([])
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

  const getManager = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employees.find(emp => emp.id === employee?.manager_id) || null;
  };

  const getPeers = (employeeId) => {
    const manager = getManager(employeeId);
    return employees.filter(emp => emp.manager_id === manager?.id && emp.id !== employeeId);
  };

  const getDirectReports = (employeeId) => {
    console.log('getDirectReports', employeeId)
    return employees.filter(emp => emp.manager_id === employeeId);
  };

  const getSecondLevelReports = (employeeId) => {
    const directReports = getDirectReports(employeeId);
    return directReports.flatMap(emp => getDirectReports(emp.id));
  };

  return (
    selectedCompany &&
    (<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Typography variant="h5">{selectedCompany.name}</Typography>
      <Box>
        <Typography><b>Total de Funcionários:</b> {selectedCompany.total_employees}</Typography>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Líderes</Typography>
        {employees.filter(emp => emp.manager_id === null).map(manager => (
          <Card key={manager.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{manager.name}</Typography>
              <Typography><b>Liderados Diretos:</b></Typography>
              <Box>
                <List>
                  {getDirectReports(manager.id).map(direct => (
                    <ListItem key={direct.id} sx={{ border: '1px solid #ddd', borderRadius: 2, mb: 1 }}>{direct.name}</ListItem>
                  ))}
                </List>
              </Box>
              <Typography><b>Liderados de Segundo Nível:</b></Typography>
              <Box>
                <List>
                  {getSecondLevelReports(manager.id).map(secondLevel => {
                    const secondLevelManager = getManager(secondLevel.id);
                    return (
                      <ListItem key={secondLevel.id} sx={{ border: '1px solid #ddd', borderRadius: 2, mb: 1 }}>
                        {secondLevel.name} (Manager: {secondLevelManager?.name || 'N/A'})
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box>
        <Typography variant="h6">Pares de Colaboradores</Typography>
        {employees.filter(emp => getPeers(emp.id).length > 0).map(emp => (
          <Card key={emp.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{emp.name}</Typography>
              <Typography><b>Pares:</b></Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getPeers(emp.id).map(peer => (
                  <Box key={peer.id} sx={{ border: '1px solid #ddd', borderRadius: 2, p: 1, width: '100%' }}>
                    {peer.name}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>)
  );
}
