import '@/styles/globals.css'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from '@/components/layout'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <CssBaseline />
      <Component {...pageProps} />
    </Layout>
  )
}
