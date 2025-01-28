import * as React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, Avatar, Grid } from '@mui/material';

export default function CompanyDetails() {
  const employees = [
    { id: 1, name: 'Alice', email: 'alice@example.com', picture: 'https://via.placeholder.com/150', managerId: 3 },
    { id: 2, name: 'Bob', email: 'bob@example.com', picture: 'https://via.placeholder.com/150', managerId: 3 },
    { id: 3, name: 'Charlie (Manager)', email: 'charlie@example.com', picture: 'https://via.placeholder.com/150', managerId: null },
    { id: 4, name: 'David', email: 'david@example.com', picture: 'https://via.placeholder.com/150', managerId: 1 },
    { id: 5, name: 'Eve', email: 'eve@example.com', picture: 'https://via.placeholder.com/150', managerId: 1 },
    { id: 6, name: 'Frank', email: 'frank@example.com', picture: 'https://via.placeholder.com/150', managerId: 2 },
    { id: 7, name: 'Grace', email: 'grace@example.com', picture: 'https://via.placeholder.com/150', managerId: 2 },
    { id: 8, name: 'Grace 2', email: 'grace@example.com', picture: 'https://via.placeholder.com/150', managerId: 2 },
    { id: 9, name: 'Helen', email: 'helen@example.com', picture: 'https://via.placeholder.com/150', managerId: 4 },
    { id: 10, name: 'Ian', email: 'ian@example.com', picture: 'https://via.placeholder.com/150', managerId: 4 },
    { id: 11, name: 'Jack', email: 'jack@example.com', picture: 'https://via.placeholder.com/150', managerId: 5 },
    { id: 12, name: 'Karen', email: 'karen@example.com', picture: 'https://via.placeholder.com/150', managerId: 5 },
    { id: 13, name: 'Leo', email: 'leo@example.com', picture: 'https://via.placeholder.com/150', managerId: 6 },
  ];


  const getManager = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employees.find(emp => emp.id === employee?.managerId) || null;
  };

  const getPeers = (employeeId) => {
    const manager = getManager(employeeId);
    return employees.filter(emp => emp.managerId === manager?.id && emp.id !== employeeId);
  };

  const getDirectReports = (employeeId) => {
    return employees.filter(emp => emp.managerId === employeeId);
  };

  const getSecondLevelReports = (employeeId) => {
    const directReports = getDirectReports(employeeId);
    return directReports.flatMap(emp => getDirectReports(emp.id));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      <Typography variant="h5" gutterBottom>Empresa 1</Typography>
      <Box>
        <Typography>
          <b>Quantidade de colaboradores:</b> {employees.length}
        </Typography>
        <Typography>
          <b>Quantidade de líderes:</b> {employees.filter(emp => emp.managerId === null).length}
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>Lista de Colaboradores</Typography>
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
        {employees.filter(emp => emp.managerId === null).map(manager => (
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
        <Typography variant="h6" gutterBottom>Pares de Colaboradores</Typography>
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
    </Box>
  );
}
