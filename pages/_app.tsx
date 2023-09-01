import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import UserContextProvider from "@/services/UserContext";
import Layout from "@/components/layout/layout";

export default function App({Component, pageProps}: AppProps) {

    return (
        <UserContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </UserContextProvider>
    )
}
