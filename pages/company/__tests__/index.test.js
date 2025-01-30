import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Company from '../index';
import { CompaniesContext } from '@/contexts/company-context';
import useCompaniesDispatch from '@/hooks/useCompaniesDispatch';

jest.mock('../../../hooks/useCompaniesDispatch');

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Company A' }]),
  })
);

const mockCompanies = [
  { id: 1, name: 'Company A', total_employees: 10, leaders_count: 2, followers_count: 8 },
  { id: 2, name: 'Company B', total_employees: 20, leaders_count: 3, followers_count: 17 },
];

const mockSelectedCompany = mockCompanies[0];

const mockDispatch = jest.fn();

const renderCompanyComponent = (companies = [], selectedCompany = null) => {
  return render(
    <CompaniesContext.Provider value={{ companies, selectedCompany }}>
      <Company />
    </CompaniesContext.Provider>
  );
};

describe('Company Component', () => {
  beforeEach(() => {
    useCompaniesDispatch.mockReturnValue(mockDispatch);
    fetch.mockClear();
    mockDispatch.mockClear();
  });

  it('matches snapshot', () => {
    const tree = renderCompanyComponent(mockCompanies, mockSelectedCompany);

    expect(tree).toMatchSnapshot();
  });
  

  it('renders the component correctly', () => {
    renderCompanyComponent(mockCompanies, mockSelectedCompany);

    expect(screen.getByText('Cadastrar Empresa')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome da Empresa')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
    expect(screen.getByText('Lista de Empresas')).toBeInTheDocument();
    expect(screen.getByText('Detalhes da Empresa')).toBeInTheDocument();
  });

  it('fetches companies on mount', async () => {
    renderCompanyComponent();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies`, {
        method: 'GET',
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'charged',
        data: {
          companies: [{ id: 1, name: 'Company A' }],
        },
      });
    });
  });

  it('submits a new company', async () => {
    renderCompanyComponent();

    const input = screen.getByLabelText('Nome da Empresa');
    const button = screen.getByText('Cadastrar');

    fireEvent.change(input, { target: { value: 'New Company' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_QULTURE_API_HOST}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New Company' }),
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'created',
        data: {
          company: [{ id: 1, name: 'Company A' }],
        },
      });
    });
  });

  it('selects a company from the list', () => {
    renderCompanyComponent(mockCompanies);

    const companyItem = screen.getByText('Company A');
    fireEvent.click(companyItem);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'selected',
      data: {
        company: mockCompanies[0],
      },
    });
  });
});
