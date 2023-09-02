import Blur from "@/components/ui/blur/blur";
import classes from "./wallets.module.scss";
import {useContext, useEffect, useState} from "react";
import {BlockchainContext} from "@/services/BlockchainContext";
import Link from "next/link";

interface Wallet {
    address: string
    owners: string[]
}

// 0xFC3cF2AC95032f0043769113f8Aa1a43a41335d5
// 0x04a4e427c147f4786Ef939A5c2d3DC1F25861AF9


export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>()
    const {getOwners} = useContext(BlockchainContext);

    useEffect(() => {
        getWallets()
    }, [])

    async function getWallets() {
        const userWallets = JSON.parse(localStorage.getItem('address') || '[]');
        if (userWallets && userWallets.length) {
            const allWallets: Wallet[] = []
            for (const walletAddress of userWallets) {
                const walletOwners: string[] = await getOwners(walletAddress);
                allWallets.push({
                    address: walletAddress,
                    owners: walletOwners
                })
            }
            setWallets(allWallets)
        }
    }

    return (
        <section className={classes.wallets_page}>
            <Blur/>
            <h1>Manage your multisig wallets</h1>
            <div className="flex flex-wrap gap-4">
                {wallets && wallets.map((wallet) => {
                    return (
                        <Link
                            href={`/wallets/${wallet.address}`}
                            key={wallet.address}
                        >
                            <article className={classes.wallet_card}>
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
                        </Link>)
                })}
            </div>
        </section>
    )
}