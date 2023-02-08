import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Sector#3</title>
        <meta name="description" content="Do Androids Dream of Electric Sheep? ⚡️🐑" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
          Do DAOs Dream of&nbsp;
            <code className={styles.code}>Electric Sheep? ⚡️🐑</code>
          </p>
          <div>
            <a
              href="https://snapshot.org/#/sector3dao.eth"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code className="text-gray-400">⚡️ /#/sector3dao.eth</code>
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <span className="text-5xl font-bold">Sector</span>
          <div className={styles.thirteen}>
            <span className="text-5xl font-bold">#3</span>
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="/daos"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className="{inter.className} text-2xl">
              Explore DAOs ⚡️
            </h2>
            <p className={inter.className}>
              Contribute to a DAO and get rewarded, with <i>complete transparency</i>.
            </p>
          </a>

          <a
            href="/new-dao"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className="{inter.className} text-2xl">
              Deploy a DAO 🚀
            </h2>
            <p className={inter.className}>
              Reward DAO contributors <i>autonomously</i> with Sector#3.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
