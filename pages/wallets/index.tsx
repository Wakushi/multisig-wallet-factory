import Blur from "@/components/ui/blur/blur";
import classes from "./wallets.module.scss";
import {useContext, useEffect, useState} from "react";
import {BlockchainContext} from "@/services/BlockchainContext";
import WalletCard from "@/components/wallet-card/wallet-card";

interface Wallet {
    address: string
    owners: string[]
}

export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>()
    const {getOwners, handleGetWalletsByOwner} = useContext(BlockchainContext);

    useEffect(() => {
        getWallets()
    }, [])

    async function getWallets() {
        const userWallets = await handleGetWalletsByOwner()
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
                    return <WalletCard wallet={wallet} key={wallet.address}/>;
                })}
            </div>
        </section>
    )
}