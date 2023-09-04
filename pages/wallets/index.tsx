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
    const [userWallets, setUserWallets] = useState<Wallet[]>()
    const {getOwners, wallets} = useContext(BlockchainContext);

    useEffect(() => {
        getWallets()
    }, [wallets])

    async function getWallets() {
        const allWallets: Wallet[] = []
        for (const walletAddress of wallets) {
            const walletOwners: string[] = await getOwners(walletAddress);
            allWallets.push({
                address: walletAddress,
                owners: walletOwners
            })
        }
        setUserWallets(allWallets)
    }

    return (
        <section className={classes.wallets_page}>
            <Blur/>
            <h1>Manage your multisig wallets</h1>
            <div className="flex flex-wrap gap-4">
                {userWallets && userWallets.map((wallet) => {
                    return <WalletCard wallet={wallet} key={wallet.address}/>;
                })}
            </div>
        </section>
    )
}