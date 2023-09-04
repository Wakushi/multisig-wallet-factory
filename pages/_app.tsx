import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import Layout from "@/components/layout/layout";
import UserContextProvider from "@/services/UserContext";
import BlockchainContextProvider from "@/services/BlockchainContext";
import SnackbarContextProvider from "@/services/SnackbarContext";
import ErrorContextProvider from "@/services/ErrorContext";

export default function App({Component, pageProps}: AppProps) {

    return (
        <ErrorContextProvider>
            <SnackbarContextProvider>
                <UserContextProvider>
                    <BlockchainContextProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </BlockchainContextProvider>
                </UserContextProvider>
            </SnackbarContextProvider>
        </ErrorContextProvider>
    )
}
