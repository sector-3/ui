import Head from 'next/head'
import Image from 'next/image'
import { PT_Mono } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const font = PT_Mono({ subsets: ['latin'], weight: '400' })

export default function Home() {
  console.log('Home')
  return (
    <>
      <Head>
        <title>Sector#3</title>
        <meta name="description" content="Do DAOs Dream of Electric Sheep? ⚡️🐑" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <video id="background-video" autoPlay loop muted poster="https://pbs.twimg.com/tweet_video_thumb/FpM9CcwagAIiRD7.jpg">
        <source src="https://video.twimg.com/tweet_video/FpM9CcwagAIiRD7.mp4" type="video/mp4" />
      </video>

      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Do DAOs Dream of&nbsp;
            <code className={styles.code}>Electric Sheep? ⚡️🐑</code>
          </p>
          <div>
            <a
              href="https://www.tally.xyz/gov/sector-3-goerli"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code className="text-gray-400">🗳️ Tally</code>
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
          <Link
            href="/daos"
            className={styles.card}
          >
            <h2 className="text-2xl">
              Explore DAOs 👀
            </h2>
            <p className={font.className}>
              Contribute to a DAO and get rewarded, with <i>complete transparency</i>.
            </p>
          </Link>

          <Link
            href="/new-dao"
            className={styles.card}
          >
            <h2 className="text-2xl">
              Deploy a DAO 🚀
            </h2>
            <p className={font.className}>
              Reward DAO contributors <i>autonomously</i> with Sector#3.
            </p>
          </Link>
        </div>
      </main>
    </>
  )
}
