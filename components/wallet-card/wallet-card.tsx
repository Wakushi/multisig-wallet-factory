import Link from "next/link";
import classes from "./wallet-card.module.scss";
import {useContext, useEffect, useState} from "react";
import {BlockchainContext} from "@/services/BlockchainContext";

interface Wallet {
    address: string
    owners: string[]
}

interface WalletCardProps {
    wallet: Wallet
}

export default function WalletCard({wallet}: WalletCardProps) {
    const [numberOfTransactions, setNumberOfTransactions] = useState<string>("0")
    const {getNumberOfTransactions} = useContext(BlockchainContext)

    useEffect(() => {
        if (wallet.address) {
            handleGetNumberOfTransactions(wallet.address)
        }
    }, []);

    async function handleGetNumberOfTransactions(walletId: string) {
        const numberOfTransactions = await getNumberOfTransactions(walletId as string)
        setNumberOfTransactions(numberOfTransactions ? numberOfTransactions.toString() : "0")
    }

    return (
        <Link
            href={`/wallets/${wallet.address}`}
            key={wallet.address}
        >
            <article className={`${classes.wallet_card} card fade-in-bottom`}>
                <span className={classes.transaction_counter}>{numberOfTransactions}</span>
                <h2>Wallet</h2>
                <p>{wallet.address}</p>
                <h3>Owners</h3>

                <ul>
                    {wallet.owners && wallet.owners.map((owner) => {
                        return <li key={owner}>{owner}</li>
                    })}
                </ul>
                <i className="fa-solid fa-angles-right"></i>
            </article>
        </Link>
    )
}