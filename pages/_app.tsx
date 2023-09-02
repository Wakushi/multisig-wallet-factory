import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import Layout from "@/components/layout/layout";
import UserContextProvider from "@/services/UserContext";
import BlockchainContextProvider from "@/services/BlockchainContext";

export default function App({Component, pageProps}: AppProps) {

    return (
        <BlockchainContextProvider>
            <UserContextProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </UserContextProvider>
        </BlockchainContextProvider>
    )
}
