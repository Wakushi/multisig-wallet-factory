import {useRouter} from "next/router";
import classes from "./wallet-details.module.scss";
import Blur from "@/components/ui/blur/blur";
import Button from "@/components/ui/button/button";
import {useContext, useEffect, useRef, useState} from "react";
import {BlockchainContext} from "@/services/BlockchainContext";
import WaitingModal from "@/components/waiting-modal/waiting-modal";
import {areAddressesValid} from "@/services/utils";

export default function WalletDetailsPage() {

    const [numberOfTransactions, setNumberOfTransactions] = useState<string>("0")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isFormValid, setIsFormValid] = useState<boolean>(true)
    const {getNumberOfTransactions, submitTransaction, isWaitingForTransaction} = useContext(BlockchainContext)
    const router = useRouter()
    const {walletId} = router.query
    const txTo = useRef<HTMLInputElement>(null)
    const txValue = useRef<HTMLInputElement>(null)
    const txData = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (walletId) {
            handleGetNumberOfTransactions(walletId as string)
        }
    }, [isWaitingForTransaction])

    async function handleGetNumberOfTransactions(walletId: string) {
        const numberOfTransactions = await getNumberOfTransactions(walletId as string)
        setNumberOfTransactions(numberOfTransactions.toString())
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

    function handleToggleModal({target}: any) {
        const authorizedIds = ["modal-container", "modal-close-btn"]
        if (authorizedIds.includes(target.id) && !isWaitingForTransaction) {
            setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
        }
    }

    function handleCreateTransaction() {
        setIsModalOpen(prevIsModalOpen => !prevIsModalOpen)
    }

    function handleDebug() {
        console.log('numberOfTransactions: ', numberOfTransactions)
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
                <h1>Wallet : {walletId}</h1>
                <p>Number of transactions : {numberOfTransactions}</p>
                <Button onClick={handleCreateTransaction}>Create a transaction</Button>
                <Button onClick={handleDebug}>Debug</Button>
                <Blur/>
            </section>
            {isModalOpen && <div id="modal-container" className={classes.create_transaction_modal} onClick={handleToggleModal}>
                <div className={classes.create_transaction_modal_inner}>
                    <i id="modal-close-btn" className="fa-solid fa-xmark"></i>
                    <h2>Create a new transaction</h2>
                    <form className="flex flex-col gap-4">
                        <label htmlFor="to">To</label>
                        <div className={classes.transaction_input}>
                            <input type="text" id="to" name="to" ref={txTo}/>
                        </div>
                        <label htmlFor="amount">Amount</label>
                        <div className={classes.transaction_input}>
                            <input type="text" id="amount" name="amount" ref={txValue}/>
                        </div>
                        <label htmlFor="data">Data</label>
                        <div className={classes.transaction_input}>
                            <input type="text" id="data" name="data" ref={txData}/>
                        </div>
                        {!isFormValid && <span className="text-rose-600">Please verify that all values are correct.</span>}
                        <Button onClick={handleTransactionFormSubmit}>Submit</Button>
                    </form>
                </div>
            </div>}
            {isWaitingForTransaction && <WaitingModal>Submitting transaction...</WaitingModal>}
        </>
    )
}