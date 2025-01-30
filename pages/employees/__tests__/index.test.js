import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Employees from '../index';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

const mockCompanies = [
  { id: 1, name: 'Company A' },
  { id: 2, name: 'Company B' },
];

const mockEmployees = [
  { id: 1, name: 'Employee 1', email: 'employee1@example.com', manager_id: null },
  { id: 2, name: 'Employee 2', email: 'employee2@example.com', manager_id: 1 },
];

describe('Employees Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const tree = render(<Employees />);

    expect(tree).toMatchSnapshot();
  });
  

  it('renders the component correctly', () => {
    render(<Employees />);

    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('URL da Foto')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar Colaborador')).toBeInTheDocument();
    expect(screen.getByText('Ver Colaboradores por Empresa')).toBeInTheDocument();
  });

  it('fetches companies on mount', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCompanies),
      })
    );

    render(<Employees />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies`, {
        method: 'GET',
      });
    });
  });
});