import { useContext } from 'react'
import { CompaniesDispatchContext } from '@/contexts/company-context';

const useCompaniesDispatch = () => {
  const dispatch = useContext(CompaniesDispatchContext);
  if (!dispatch) {
    throw new Error('CompaniesDispatchContext must be used within a CompaniesProvider');
  }
  return dispatch;
}

export default useCompaniesDispatch;
