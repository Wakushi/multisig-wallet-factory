import Blur from "@/components/ui/blur/blur";
import classes from "./create.module.scss";
import {useEffect, useState} from "react";
import Button from "@/components/ui/button/button";
import {ethers, BaseContract} from "ethers";
import {multiSigWalletFactoryAbi, multiSigWalletFactoryAddress} from "@/services/constants";
import {saveMultiSigAddress, verifyAddresses} from "@/services/utils";
import WaitingModal from "@/components/waiting-modal/waiting-modal";
import {useRouter} from "next/router";

interface MultiSigWalletFactoryContract extends BaseContract {
    deployMultiSigWallet(ownerAddresses: string[], requiredConfirmationsAmount: number): Promise<void>

    // ... other methods and properties
}

export default function CreatePage() {

    const [ownersAddresses, setOwnersAddresses] = useState<string[]>(["", ""])
    const [numberOfConfirmation, setNumberOfConfirmation] = useState<number>(2)
    const [areAddressesValid, setAreAddressesValid] = useState<boolean>(true)
    const [isWaitingForTransaction, setIsWaitingForTransaction] = useState<boolean>(false)
    const router = useRouter()
    let ethereum: any;

    useEffect(() => {
        ethereum = (window as any).ethereum;
        listenToEvents();
    }, [])

    function handleAddOwnerInput() {
        setOwnersAddresses(prevOwnersAddresses => [...prevOwnersAddresses, ""])
    }

    function handleRemoveOwnerInput(index: number) {
        setOwnersAddresses(prevOwnersAddresses => {
            const newOwnersInput = [...prevOwnersAddresses]
            newOwnersInput.splice(index, 1)
            return newOwnersInput
        })
    }

    function handleOwnerInput(index: number, newAddress: string) {
        setAreAddressesValid(true)
        setOwnersAddresses(prevOwnersAddresses => {
            const newOwnersInput = [...prevOwnersAddresses];
            newOwnersInput[index] = newAddress;
            return newOwnersInput;
        });
    }

    function handleConfirmationInput(numberOfConfirmation: number) {
        setNumberOfConfirmation(numberOfConfirmation)
    }

    function handleSubmit() {
        if (!verifyAddresses(ownersAddresses) || numberOfConfirmation < 2) {
            setAreAddressesValid(false)
        } else {
            createMultiSigWallet(ownersAddresses, numberOfConfirmation)
        }
    }

    async function createMultiSigWallet(ownersAddresses: string[], requiredConfirmationsAmount: number) {
        console.log("selectedOwnerAddresses: ", ownersAddresses)
        console.log("requiredConfirmationsAmount: ", requiredConfirmationsAmount)
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

    function listenToEvents() {
        console.log('Listening to events...')
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(multiSigWalletFactoryAddress, multiSigWalletFactoryAbi, provider)
        contract.on("MultiSigWalletDeployed", (owners, requiredConfirmationsAmount, contractAddress) => {
            console.log(`MultiSigWallet deployed at ${contractAddress} with ${requiredConfirmationsAmount} confirmations required.`)
            console.log("owners :", owners)
            saveMultiSigAddress(contractAddress)
            setIsWaitingForTransaction(false)
            router.push("/wallets")
        })
    }

    function listenForTransactionMine(transactionResponse: any, provider: any) {
        console.log(`Mining ${transactionResponse.hash}`)
        return new Promise<void>((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt: any) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        })
    }

    return (
        <>

            <section className={`${classes.create} flex flex-col`}>
                <Blur/>
                <h1>Create your multisig wallet</h1>
                <p>Please enter the number of confirmations required for every future transaction of this wallet.</p>
                <div className="flex">
                    <span>Every transaction will require </span>
                    <div className={classes.confirmation_input}>
                        <input type="number" placeholder="2" min="2" onChange={(e) => handleConfirmationInput(+e.target.value)}/>
                    </div>
                    <span>owner confirmations.</span>

                </div>
                <p className={classes.small_text}>Note : there should be at least two owners minimum, and two confirmation required minimum.</p>
                <p>Please enter the owners address.</p>
                <div className={`${classes.owners_input_list} flex flex-wrap items-center gap-4`}>
                    {ownersAddresses.map((address, index) => {
                        return (
                            <div key={index} className={classes.owner_input}>
                                {index > 1 &&
                                    <i className="fa-solid fa-circle-minus" onClick={() => handleRemoveOwnerInput(index)}></i>
                                }
                                <input
                                    value={address}
                                    type="text"
                                    placeholder="0x00..."
                                    onChange={(e) => handleOwnerInput(index, e.target.value)}
                                />
                            </div>
                        )
                    })}
                    <i className="fa-solid fa-plus" onClick={handleAddOwnerInput}></i>
                </div>
                <div className="flex items-center justify-between">
                    {!areAddressesValid && <span className="text-rose-600">Please verify all addresses format.</span>}
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </section>
            {isWaitingForTransaction && <WaitingModal/>}
        </>
    )
}