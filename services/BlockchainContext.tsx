import React, {createContext, useState, ReactNode, useEffect} from 'react';
import {ethers} from "ethers";
import {multiSigWalletAbi, multiSigWalletFactoryAbi, multiSigWalletFactoryAddress} from "@/services/constants";
import {saveMultiSigAddress} from "@/services/utils";
import {useRouter} from "next/router";

interface BlockchainContextProviderProps {
    children: ReactNode;
}

interface BlockchainContextProps {
    createMultiSigWallet: (ownersAddresses: string[], requiredConfirmationsAmount: number) => void;
    setAreAddressesValidated: (areAddressesValidated: boolean) => void;
    submitTransaction: (multiSigAddress: string, destination: string, value: string, data: string) => void;
    isWaitingForTransaction: boolean;
    areAddressesValidated: boolean;

    getOwners(multiSigAddress: string): Promise<string[]>;

    getNumberOfTransactions(multiSigAddress: string): Promise<number>;

    getTransactionByIndex(multiSigAddress: string, index: number): Promise<any>;
}

const BlockchainContext = createContext<BlockchainContextProps>({
    createMultiSigWallet: (ownersAddresses: string[], requiredConfirmationsAmount: number) => {
    },
    setAreAddressesValidated: (areAddressesValidated: boolean) => {
    },
    submitTransaction: (multiSigAddress: string, destination: string, value: string, data: string) => {
    },
    getOwners: (multiSigAddress: string): Promise<string[]> => {
        return new Promise<string[]>(() => {
        })
    },
    getNumberOfTransactions: (multiSigAddress: string): Promise<number> => {
        return new Promise<number>(() => {
        })
    },
    getTransactionByIndex: (multiSigAddress: string, index: number): Promise<any> => {
        return new Promise<any>(() => {
        })
    },
    isWaitingForTransaction: false,
    areAddressesValidated: true
});

export default function BlockchainContextProvider(props: BlockchainContextProviderProps) {
    const [isWaitingForTransaction, setIsWaitingForTransaction] = useState<boolean>(false)
    const [areAddressesValidated, setAreAddressesValidated] = useState<boolean>(true)

    const router = useRouter()

    useEffect(() => {
        listenToFactoryEvents();
    }, [])

    ////////////////////////////////////
    // MultiSigWalletFactory Methods  //
    ////////////////////////////////////
    async function createMultiSigWalletHandler(ownersAddresses: string[], requiredConfirmationsAmount: number) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(multiSigWalletFactoryAddress, multiSigWalletFactoryAbi, signer)
            try {
                const transactionResponse = await contract.deployMultiSigWallet(ownersAddresses, requiredConfirmationsAmount)
                setIsWaitingForTransaction(true)
                listenForTransactionMine(transactionResponse, provider)
            } catch (error) {
                console.log(error)
                setAreAddressesValidated(false)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    /////////////////////////////
    // MultiSigWallet Methods  //
    /////////////////////////////

    async function getOwners(multiSigAddress: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                const transactionResponse = await contract.getOwners()
                return transactionResponse
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function getNumberOfTransactions(multiSigAddress: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                const transactionResponse = await contract.getNumberOfTransactions()
                return transactionResponse
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function submitTransaction(multiSigAddress: string, destination: string, value: string, data: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, signer)
            const valueInWei = ethers.parseEther(value);
            const dataInBytes = ethers.toUtf8Bytes(data);
            try {
                const transactionResponse = await contract.proposeTransaction(destination, valueInWei, dataInBytes)
                setIsWaitingForTransaction(true)
                // listenToWalletEvents(multiSigAddress)
                listenForTransactionMine(transactionResponse, provider)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function getTransactionByIndex(multiSigAddress: string, index: number) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                const transactionResponse = await contract.getTransactionByIndex(index)
                return {
                    to: transactionResponse[0],
                    value: ethers.formatEther(transactionResponse[1]),
                    data: transactionResponse[2],
                    executed: transactionResponse[3],
                    numberOfConfirmations: transactionResponse[4].toString()
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    ////////////////////////////////
    //  General Methods & Events  //
    ////////////////////////////////

    function listenToFactoryEvents() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(multiSigWalletFactoryAddress, multiSigWalletFactoryAbi, provider)
        contract.on("MultiSigWalletDeployed", (_, __, contractAddress) => {
            saveMultiSigAddress(contractAddress)
            setIsWaitingForTransaction(false)
            router.push("/wallets")
        })
    }

    //errors.js:113 Uncaught (in promise) TypeError: unknown fragment (argument="event", value="SubmitTransaction", code=INVALID_ARGUMENT, version=6.7.1)
    // function listenToWalletEvents(walletAddress: string) {
    //     const provider = new ethers.BrowserProvider(window.ethereum);
    //     const contract = new ethers.Contract(walletAddress, multiSigWalletFactoryAbi, provider)
    //     contract.on("SubmitTransaction", (msg_sender, txIndex, to, value, data) => {
    //         console.log(`New transaction from ${msg_sender} to ${to} with value ${value} and data ${data}`)
    //         setIsWaitingForTransaction(false)
    //     })
    // }


    function listenForTransactionMine(transactionResponse: any, provider: any) {
        console.log(`Mining ${transactionResponse.hash}`)
        return new Promise<void>((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt: any) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                setIsWaitingForTransaction(false)
                resolve()
            })
        })
    }


    const context: BlockchainContextProps = {
        createMultiSigWallet: createMultiSigWalletHandler,
        setAreAddressesValidated: setAreAddressesValidated,
        submitTransaction: submitTransaction,
        getOwners: getOwners,
        getNumberOfTransactions: getNumberOfTransactions,
        getTransactionByIndex: getTransactionByIndex,
        isWaitingForTransaction: isWaitingForTransaction,
        areAddressesValidated: areAddressesValidated
    };

    return (
        <BlockchainContext.Provider value={context}>
            {props.children}
        </BlockchainContext.Provider>
    );
}

export {BlockchainContext};
