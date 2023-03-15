import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const {data: session} = useSession()
  return (
    <main>
    <div className={styles.center}>
      <h1 className={styles.title}>
        faceGPT
      </h1>
      <p className={styles.description}>
        Make your face look cooler with the power of AI
      </p>
      <center>
        { !session ? (
      <button className={styles.button} onClick={() => signIn()}>
        Get Started!
      </button>
      ) : (
      <Link href="/app">
        <button className={styles.button}>
          Get Started!m
        </button>
      </Link>
      )}
      </center>
    </div>
    </main>
  )
}