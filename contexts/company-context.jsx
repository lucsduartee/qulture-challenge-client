import React, { createContext, useReducer } from 'react'

export const CompaniesContext = createContext()
export const CompaniesDispatchContext = createContext()

const initialCompanies = {
  selectedCompany: null,
  companies: [],
};

function companiesReducer(companies, action) {
  switch (action.type) {
    case 'charged': {
      return {
        ...companies,
        companies: action.data.companies
      }
    }
    case 'created': {
      return {
        ...companies,
        companies: [...companies.companies, action.data.company]
      }
    }
    case 'selected': {
      return {
        ...companies,
        selectedCompany: action.data.company
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function CompaniesProvider({ children }) {
  const [companies, dispatch] = useReducer(
    companiesReducer,
    initialCompanies,
  );

  return (
    <CompaniesContext.Provider value={companies}>
      <CompaniesDispatchContext.Provider value={dispatch}>
        { children }
      </CompaniesDispatchContext.Provider>
    </CompaniesContext.Provider>
  )
}