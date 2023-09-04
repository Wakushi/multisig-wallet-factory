import classes from './transaction-card.module.scss'
import {useEffect, useState} from "react";

interface TransactionCardProps {
    id: number;
    to: string;
    value: string;
    data: string;
    executed: boolean;
    numberOfConfirmations: number;
    requiredAmountOfConfirmations: number;
    handleConfirmTransaction: (transactionIndex: number) => void;
    handleRevokeTransaction: (transactionIndex: number) => void;
    handleExecuteTransaction: (transactionIndex: number, transactionValue: number) => void;
    handleHasOwnerConfirmedTx: (transactionIndex: number) => Promise<boolean>;
}

export default function TransactionCard({
                                            id,
                                            to,
                                            value,
                                            data,
                                            executed,
                                            numberOfConfirmations,
                                            requiredAmountOfConfirmations,
                                            handleConfirmTransaction,
                                            handleRevokeTransaction,
                                            handleExecuteTransaction,
                                            handleHasOwnerConfirmedTx
                                        }: TransactionCardProps) {

    const [ownerConfirmedTx, setOwnerConfirmedTx] = useState<boolean>(false)

    useEffect(() => {
        handleHasOwnerConfirmedTx(id).then((result) => {
            setOwnerConfirmedTx(result)
        })
    }, [numberOfConfirmations])

    function isTransactionExecutable() {
        return !executed && numberOfConfirmations >= requiredAmountOfConfirmations
    }

    return (
        <article className={`card fade-in-bottom ${executed ? classes.executed : ""}`}>
            <p><span className="font-bold">To :</span> {to}</p>
            <p><span className="font-bold">Value:</span> {value} Ξ</p>
            <p><span className="font-bold">Data:</span> {data}</p>
            <p><span className="font-bold">Executed:</span> {executed ? 'Yes' : 'No'}</p>
            <p><span className="font-bold">Confirmations:</span> {numberOfConfirmations}</p>
            {!executed && <div className="flex items-center gap-4 mt-2">
                {isTransactionExecutable() &&
                    <button onClick={() => handleExecuteTransaction(id, +value)}
                            className={`${classes.small_btn} ${classes.execute_btn}`}>Execute</button>}
                {ownerConfirmedTx ?
                    <button onClick={() => handleRevokeTransaction(id)} className={`${classes.small_btn} ${classes.revoke_btn}`}>Revoke</button> :
                    <button onClick={() => handleConfirmTransaction(id)} className={`${classes.small_btn} ${classes.confirm_btn}`}>Confirm
                    </button>
                }
            </div>}
        </article>
    )
}