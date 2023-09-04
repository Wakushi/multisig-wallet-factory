import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ethers} from "ethers";
import {multiSigWalletAbi, multiSigWalletFactoryAbi, multiSigWalletFactoryAddress} from "@/services/constants";
import {saveMultiSigAddress} from "@/services/utils";
import {useRouter} from "next/router";
import {UserContext} from "@/services/UserContext";

interface BlockchainContextProviderProps {
    children: ReactNode;
}

interface BlockchainContextProps {
    createMultiSigWallet: (ownersAddresses: string[], requiredConfirmationsAmount: number) => void;
    submitTransaction: (multiSigAddress: string, destination: string, value: string, data: string) => void;
    confirmTransaction: (multiSigAddress: string, transactionIndex: number) => void;
    revokeConfirmation: (multiSigAddress: string, transactionIndex: number) => void;
    executeTransaction: (multiSigAddress: string, transactionIndex: number) => void;

    isWaitingForTransaction: boolean;

    getOwners(multiSigAddress: string): Promise<string[]>;

    getNumberOfTransactions(multiSigAddress: string): Promise<number>;

    getTransactionByIndex(multiSigAddress: string, index: number): Promise<any>;

    checkHasOwnerConfirmedTx(multiSigAddress: string, transactionIndex: number): Promise<any>;

    getRequiredAmountOfConfirmations(multiSigAddress: string): Promise<any>;

    getWalletBalance(multiSigAddress: string): Promise<any>;

    handleGetWalletsByOwner(): Promise<any>;
}

const BlockchainContext = createContext<BlockchainContextProps>({
    createMultiSigWallet: (ownersAddresses: string[], requiredConfirmationsAmount: number) => {
    },
    submitTransaction: (multiSigAddress: string, destination: string, value: string, data: string) => {
    },
    confirmTransaction: (multiSigAddress: string, transactionIndex: number) => {
    },
    revokeConfirmation: (multiSigAddress: string, transactionIndex: number) => {
    },
    executeTransaction: (multiSigAddress: string, transactionIndex: number) => {
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
    checkHasOwnerConfirmedTx: (multiSigAddress: string, transactionIndex: number): Promise<any> => {
        return new Promise<any>(() => {
        })
    },
    getRequiredAmountOfConfirmations: (multiSigAddress: string): Promise<any> => {
        return new Promise<any>(() => {
        })
    },
    getWalletBalance: (multiSigAddress: string): Promise<any> => {
        return new Promise<any>(() => {
        })
    },
    handleGetWalletsByOwner: (): Promise<any> => {
        return new Promise<any>(() => {
        })
    },
    isWaitingForTransaction: false,
});

export default function BlockchainContextProvider(props: BlockchainContextProviderProps) {
    const [isWaitingForTransaction, setIsWaitingForTransaction] = useState<boolean>(false)
    const {walletAddress} = useContext(UserContext)
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
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function handleGetWalletsByOwner() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigWalletFactoryAddress, multiSigWalletFactoryAbi, provider)
            try {
                return await contract.getWalletsByOwner(walletAddress)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    /////////////////////////////
    // MultiSigWallet Methods  //
    /////////////////////////////

    //////////////
    // READONLY //
    //////////////

    async function getOwners(multiSigAddress: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                return await contract.getOwners()
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

    async function checkHasOwnerConfirmedTx(multiSigAddress: string, transactionIndex: number) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                return await contract.hasOwnerConfirmedTx(walletAddress, transactionIndex)
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

    async function getRequiredAmountOfConfirmations(multiSigAddress: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                const transactionResponse = await contract.getRequireAmountOfConfirmations()
                return transactionResponse.toString()
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function getWalletBalance(multiSigAddress: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            try {
                const balance = await provider.getBalance(multiSigAddress);
                return ethers.formatEther(balance)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    //////////////
    //  WRITE   //
    //////////////

    async function submitTransaction(multiSigAddress: string, destination: string, value: string, data: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, signer)
            const valueInWei = ethers.parseEther(value);
            // const dataInBytes = ethers.toUtf8Bytes(data);
            try {
                const transactionResponse = await contract.proposeTransaction(destination, valueInWei, data)
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

    async function confirmTransaction(multiSigAddress: string, transactionIndex: number) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, signer)
            try {
                const transactionResponse = await contract.confirmTransaction(transactionIndex)
                setIsWaitingForTransaction(true)
                listenForTransactionMine(transactionResponse, provider)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function executeTransaction(multiSigAddress: string, transactionIndex: number) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, signer)
            try {
                const transactionResponse = await contract.executeTransaction(transactionIndex)
                setIsWaitingForTransaction(true)
                listenForTransactionMine(transactionResponse, provider)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    async function revokeConfirmation(multiSigAddress: string, transactionIndex: number) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, signer)
            try {
                const transactionResponse = await contract.revokeConfirmation(transactionIndex)
                setIsWaitingForTransaction(true)
                listenForTransactionMine(transactionResponse, provider)
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
        submitTransaction: submitTransaction,
        confirmTransaction: confirmTransaction,
        revokeConfirmation: revokeConfirmation,
        executeTransaction: executeTransaction,
        getOwners: getOwners,
        getNumberOfTransactions: getNumberOfTransactions,
        getTransactionByIndex: getTransactionByIndex,
        checkHasOwnerConfirmedTx: checkHasOwnerConfirmedTx,
        getRequiredAmountOfConfirmations: getRequiredAmountOfConfirmations,
        getWalletBalance: getWalletBalance,
        handleGetWalletsByOwner: handleGetWalletsByOwner,
        isWaitingForTransaction: isWaitingForTransaction,
    };

    return (
        <BlockchainContext.Provider value={context}>
            {props.children}
        </BlockchainContext.Provider>
    );
}

export {BlockchainContext};
