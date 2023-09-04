import {useRouter} from "next/router";
import classes from "./wallet-details.module.scss";
import Blur from "@/components/ui/blur/blur";
import Button from "@/components/ui/button/button";
import {useContext, useEffect, useRef, useState} from "react";
import WaitingModal from "@/components/waiting-modal/waiting-modal";
import {getShortenedAddress} from "@/services/utils";
import CreateTransactionModal from "@/components/create-transaction-modal/create-transaction-modal";
import TransactionCard from "@/components/transaction-card/transaction-card";
import {BlockchainContext} from "@/services/BlockchainContext";
import {SnackbarContext} from "@/services/SnackbarContext";
import {ErrorContext} from "@/services/ErrorContext";

interface Transaction {
    to: string;
    value: string;
    data: string;
    executed: boolean;
    numberOfConfirmations: number;
}

export default function WalletDetailsPage() {

    const [numberOfTransactions, setNumberOfTransactions] = useState<string>("0")
    const [requiredAmountOfConfirmations, setRequiredAmountOfConfirmations] = useState<string>("0")
    const [walletBalance, setWalletBalance] = useState<string>("0")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isFormValid, setIsFormValid] = useState<boolean>(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [owners, setOwners] = useState<string[]>([])
    const {
        getNumberOfTransactions,
        submitTransaction,
        getTransactionByIndex,
        getOwners,
        checkHasOwnerConfirmedTx,
        confirmTransaction,
        revokeConfirmation,
        executeTransaction,
        getRequiredAmountOfConfirmations,
        getWalletBalance,
        isWaitingForTransaction
    } = useContext(BlockchainContext)
    const {openSnackBar} = useContext(SnackbarContext)
    const {areAddressesValid} = useContext(ErrorContext)
    const router = useRouter()
    const {walletId} = router.query
    const txTo = useRef<HTMLInputElement>(null)
    const txValue = useRef<HTMLInputElement>(null)
    const txData = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (walletId) {
            handleGetNumberOfTransactions(walletId as string)
            handleGetRequiredAmountOfConfirmations()
            handleGetOwners()
            handleGetWalletBalance()
        }
        if (+numberOfTransactions > 0) {
            handleGetAllTransactions()
        }
    }, [numberOfTransactions, isWaitingForTransaction])

    /////////////////////////////
    // MultiSigWallet Methods  //
    /////////////////////////////

    //////////////
    // READONLY //
    //////////////

    async function handleGetNumberOfTransactions(walletId: string) {
        const numberOfTransactions = await getNumberOfTransactions(walletId as string)
        setNumberOfTransactions(numberOfTransactions ? numberOfTransactions.toString() : "0")
    }

    async function handleHasOwnerConfirmedTx(transactionIndex: number): Promise<boolean> {
        return await checkHasOwnerConfirmedTx(walletId as string, transactionIndex)
    }

    async function handleGetAllTransactions() {
        const transactions = []
        for (let i = 0; i < +numberOfTransactions; i++) {
            const transaction: Transaction = await getTransactionByIndex(walletId as string, i)
            transactions.push(transaction)
        }
        setTransactions([...transactions])
    }

    async function handleGetOwners() {
        const owners = await getOwners(walletId as string)
        if (owners) {
            setOwners(owners)
        }
    }

    async function handleGetRequiredAmountOfConfirmations() {
        const requiredAmountOfConfirmations = await getRequiredAmountOfConfirmations(walletId as string)
        setRequiredAmountOfConfirmations(requiredAmountOfConfirmations ? requiredAmountOfConfirmations.toString() : "0")
    }

    async function handleGetWalletBalance() {
        const balance = await getWalletBalance(walletId as string)
        setWalletBalance(balance)
    }

    //////////////
    //  WRITE   //
    //////////////

    function handleConfirmTransaction(transactionIndex: number) {
        confirmTransaction(walletId as string, transactionIndex)
    }

    function handleRevokeTransaction(transactionIndex: number) {
        revokeConfirmation(walletId as string, transactionIndex)
    }

    function handleExecuteTransaction(transactionIndex: number, transactionValue: number) {
        if (transactionValue > +walletBalance) {
            openSnackBar("lowBalance")
            return
        }
        executeTransaction(walletId as string, transactionIndex)
    }

    ///////////////////////////
    //   GENERAL METHODS     //
    ///////////////////////////

    function handleTransactionFormSubmit(event: any) {
        event.preventDefault()
        const to = txTo.current?.value
        const value = txValue.current?.value
        const data = txData.current?.value

        if (value && isNaN(+value) || !to || !value || !areAddressesValid([to])) {
            setIsFormValid(false)
            return
        }

        setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
        submitTransaction(walletId as string, to, value, data ? data : "0x00")
    }

    function handleToggleModal({target}: any) {
        const authorizedIds = ["modal-container", "modal-close-btn"]
        if (authorizedIds.includes(target.id) && !isWaitingForTransaction) {
            setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
            setIsFormValid(true)
        }
    }

    function handleOnCreateTransaction() {
        setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
    }

    function handleCopyWalletToClipboard() {
        navigator.clipboard.writeText(walletId as string)
        openSnackBar("copy")
    }

    return (
        <>
            <section className={classes.wallet_details}>
                <i
                    className="fa-solid fa-left-long"
                    onClick={() => {
                        router.push('/wallets')
                    }}>
                </i>
                <div className={`${classes.wallet_details_head} flex flex-col gap-1 fade-in-bottom brand-container`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1>{getShortenedAddress(walletId as string)} </h1>
                            <i onClick={handleCopyWalletToClipboard} className="fa-regular fa-copy"></i>
                        </div>
                        <p className={classes.subtitle}>Total : {walletBalance} Ξ</p>
                    </div>
                    <p className={classes.subtitle}>Owners : ({requiredAmountOfConfirmations} confirmations required)</p>
                    <ul>
                        {owners && owners.map((owner) => {
                            return <li key={owner}>{owner}</li>
                        })}
                    </ul>
                    <div className="flex items-center justify-between">
                        <p className={classes.subtitle}>Number of transactions : {numberOfTransactions}</p>
                        <Button onClick={handleOnCreateTransaction}>Create a transaction</Button>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    {transactions.map(({
                                           to,
                                           value,
                                           data,
                                           executed,
                                           numberOfConfirmations
                                       }, index) => {
                        return (
                            <TransactionCard
                                key={index}
                                id={index}
                                to={to}
                                value={value}
                                data={data}
                                executed={executed}
                                numberOfConfirmations={numberOfConfirmations}
                                requiredAmountOfConfirmations={+requiredAmountOfConfirmations}
                                handleConfirmTransaction={handleConfirmTransaction}
                                handleRevokeTransaction={handleRevokeTransaction}
                                handleExecuteTransaction={handleExecuteTransaction}
                                handleHasOwnerConfirmedTx={() => handleHasOwnerConfirmedTx(index)}
                            />
                        )
                    })}
                </div>
                <Blur/>
            </section>
            {isModalOpen &&
                <CreateTransactionModal
                    handleToggleModal={handleToggleModal}
                    handleTransactionFormSubmit={handleTransactionFormSubmit}
                    isFormValid={isFormValid}
                    txTo={txTo}
                    txValue={txValue}
                    txData={txData}
                />}
            {isWaitingForTransaction && <WaitingModal>Submitting transaction...</WaitingModal>}
        </>
    )
}