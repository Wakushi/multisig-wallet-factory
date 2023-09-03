import {useRouter} from "next/router";
import classes from "./wallet-details.module.scss";
import Blur from "@/components/ui/blur/blur";
import Button from "@/components/ui/button/button";
import {useContext, useEffect, useRef, useState} from "react";
import {BlockchainContext} from "@/services/BlockchainContext";
import WaitingModal from "@/components/waiting-modal/waiting-modal";
import {areAddressesValid, getShortenedAddress} from "@/services/utils";
import CreateTransactionModal from "@/components/create-transaction-modal/create-transaction-modal";
import TransactionCard from "@/components/transaction-card/transaction-card";

interface Transaction {
    to: string;
    value: string;
    data: string;
    executed: boolean;
    numberOfConfirmations: number;
}

export default function WalletDetailsPage() {

    const [numberOfTransactions, setNumberOfTransactions] = useState<string>("0")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isFormValid, setIsFormValid] = useState<boolean>(true)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [owners, setOwners] = useState<string[]>([])
    const {getNumberOfTransactions, submitTransaction, isWaitingForTransaction, getTransactionByIndex, getOwners} = useContext(BlockchainContext)
    const router = useRouter()
    const {walletId} = router.query
    const txTo = useRef<HTMLInputElement>(null)
    const txValue = useRef<HTMLInputElement>(null)
    const txData = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (walletId) {
            handleGetNumberOfTransactions(walletId as string)
            handleGetOwners()
        }
        if (+numberOfTransactions > 0) {
            handleGetAllTransactions()
        }
    }, [numberOfTransactions, isWaitingForTransaction])

    async function handleGetNumberOfTransactions(walletId: string) {
        const numberOfTransactions = await getNumberOfTransactions(walletId as string)
        setNumberOfTransactions(numberOfTransactions ? numberOfTransactions.toString() : "0")
    }

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

    async function handleGetAllTransactions() {
        const transactions = []
        for (let i = 0; i < +numberOfTransactions; i++) {
            const transaction: Transaction = await getTransactionByIndex(walletId as string, i)
            transactions.push(transaction)
        }
        setTransactions(transactions)
    }

    async function handleGetOwners() {
        const owners = await getOwners(walletId as string)
        if (owners) {
            setOwners(owners)
        }
    }

    function handleToggleModal({target}: any) {
        const authorizedIds = ["modal-container", "modal-close-btn"]
        if (authorizedIds.includes(target.id) && !isWaitingForTransaction) {
            setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
            setIsFormValid(true)
        }
    }

    function handleCreateTransaction() {
        setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
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
                <div className={`${classes.wallet_details_head} flex flex-col gap-1`}>
                    <div className="flex items-center justify-between">
                        <h1>{getShortenedAddress(walletId as string)} <i className="fa-regular fa-copy"></i></h1>
                        <p className={classes.subtitle}>Total : {numberOfTransactions} Ξ</p>
                    </div>
                    <p className={classes.subtitle}>Owners :</p>
                    <ul>
                        {owners && owners.map((owner) => {
                            return <li key={owner}>{owner}</li>
                        })}
                    </ul>
                    <div className="flex items-center justify-between">
                        <p className={classes.subtitle}>Number of transactions : {numberOfTransactions}</p>
                        <Button filled={true} onClick={handleCreateTransaction}>Create a transaction</Button>
                    </div>
                </div>
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
                            to={to}
                            value={value}
                            data={data}
                            executed={executed}
                            numberOfConfirmations={numberOfConfirmations}
                        />
                    )
                })}
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