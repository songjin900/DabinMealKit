import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import {Nunito} from '@next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (url: string) => fetch(url).then((response) => response.json()) }}>
      <div className={`w-full mx-auto ${nunito.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </SWRConfig>

  )
}
