import Image from 'next/image'
import styles from './styles.module.css'
import Button from '@mui/material/Button'
import Box from'@mui/material/Box'
import { useRouter } from 'next/router'

export default function WelcomeStep() {
  const router = useRouter()

  return (
    <Box component="section" className={styles.welcomeStepContainer}>
      <Box className={styles.welcomeStepMain}>
        <Image
          src="/LOGO.svg"
          alt="Qulture Rocks Logo"
          width={300}
          height={38}
          priority
          className={styles.welcomeStepImage}
        />

        <h1 className={styles.welcomeStepTitle}>Bem Vindo!</h1>

        <p className={styles.welcomeStepContent}>
          Este é um projeto para gerenciamento organizacional de uma empresa.
          Com ele você pode adicionar colaboradores, gerenciar promoções e ter um
          overview de sua Organização!
        </p>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#CB90FF',
            fontWeight: '600'
          }}
          onClick={() => router.push('/company')}
        >
          Explorar
        </Button>

        <div className={styles.welcomeStepFooter}>
          © 2025 - <b>Lucas Duarte</b> em um challenge com a <b>Qulture</b> 🤘🏽
        </div>
      </Box>
    </Box>
  )
}