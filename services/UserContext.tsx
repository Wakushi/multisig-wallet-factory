import React, {createContext, useState, ReactNode} from 'react';

interface UserContextProviderProps {
    children: ReactNode;
}

interface UserContextProps {
    walletAddress: string | null;
    connectWallet: () => void;
}

const UserContext = createContext<UserContextProps>({
    walletAddress: null,
    connectWallet: () => {
    }
});

export default function UserContextProvider(props: UserContextProviderProps) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    async function connectWalletHandler() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
                setWalletAddress(accounts[0])
            } catch (error) {
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
