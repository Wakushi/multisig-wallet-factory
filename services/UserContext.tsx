import React, {createContext, useState, ReactNode, useEffect} from 'react';
import {useRouter} from "next/router";

interface UserContextProviderProps {
    children: ReactNode;
}

interface UserContextProps {
    walletAddress: string | null;
    connectWallet: () => Promise<string | undefined>;
}

const UserContext = createContext<UserContextProps>({
    walletAddress: null,
    connectWallet: (): Promise<string | undefined> => {
        return new Promise<string | undefined>(() => {
        });
    }
});

export default function UserContextProvider(props: UserContextProviderProps) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        connectWalletHandler()
    }, [])

    async function connectWalletHandler(): Promise<string | undefined> {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
                setWalletAddress(accounts[0])
                return accounts[0]
            } catch (error) {
                router.push('/')
                console.error(error)
            }
        }
    }

    const context: UserContextProps = {
        connectWallet: connectWalletHandler,
        walletAddress: walletAddress,
    };

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    );
}

export {UserContext};
