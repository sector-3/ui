import Head from 'next/head'
import Image from 'next/image'
import { Aboreto } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Aboreto({ subsets: ['latin'], weight: '400' })

export default function DAO({ dao }: any) {
  console.log('DAO')

  console.log('dao:', dao)

  return (
    <>
      <Head>
        <title>Sector#3</title>
        <meta name="description" content="Do DAOs Dream of Autonomous Sheep? ⚡️🐑" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            <Image
              alt="Logo"
              width={64}
              height={64}
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
            /> <b>{dao.name}</b> {dao.purpose}
          </p>
        </div>

        <div className='container mt-4'>
          <h2 className="text-2xl text-gray-400">Priorities:</h2>
        </div>

        <div className='container'>
          <div className='container mt-4 p-6 bg-gray-800 rounded-xl'>
            Priority 3...
          </div>

          <div className='container mt-4 p-6 bg-gray-800 rounded-xl'>
            Priority 2...
          </div>

          <div className='container mt-4 p-6 bg-gray-800 rounded-xl'>
            Priority 1...
          </div>
        </div>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  console.log('getStaticPaths')

  return {
    paths: [
      // { params: { address: '0x96Bf89193E2A07720e42bA3AD736128a45537e63' } }
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps(context: any) {
  console.log('getStaticProps')

  const address: string = context.params.address;
  console.log('address:', address)

  const dao = {
    name: '<name>',
    purpose: '<purpose>',
    address: address
  }

  return {
    props: {
      dao: dao
    }
  }
}
