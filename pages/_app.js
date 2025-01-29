import '@/styles/globals.css'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from '@/components/layout'
import CompaniesProvider from '@/contexts/company-context'

export default function App({ Component, pageProps }) {
  return (
    <CompaniesProvider>
      <Layout>
        <CssBaseline />
        <Component {...pageProps} />
      </Layout>
    </CompaniesProvider>
  )
}
