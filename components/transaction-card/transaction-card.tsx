import classes from './transaction-card.module.scss'

interface TransactionCardProps {
    to: string;
    value: string;
    data: string;
    executed: boolean;
    numberOfConfirmations: number;
}

export default function TransactionCard({to, value, data, executed, numberOfConfirmations}: TransactionCardProps) {
    return (
        <article className="card fade-in-bottom">
            <p>To : {to}</p>
            <p>Value: {value} Ξ</p>
            <p>Data: {data}</p>
            <p>Executed: {executed ? 'Yes' : 'No'}</p>
            <p>Confirmations: {numberOfConfirmations}</p>
            <div className="flex items-center gap-4 mt-2">
                <button className={`${classes.small_btn} ${classes.execute_btn}`}>Execute</button>
                <button className={`${classes.small_btn} ${classes.confirm_btn}`}>Confirm</button>
            </div>
        </article>
    )
}