import Blur from "@/components/ui/blur/blur";
import classes from "./wallets.module.scss";
import {useContext, useEffect, useState} from "react";
import {BlockchainContext} from "@/services/BlockchainContext";
import WalletCard from "@/components/wallet-card/wallet-card";
import Button from "@/components/ui/button/button";
import {useRouter} from "next/router";
import Loader from "@/components/ui/loader/loader";

interface Wallet {
    address: string
    owners: string[]
}

export default function WalletsPage() {
    const [userWallets, setUserWallets] = useState<Wallet[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {getOwners, wallets} = useContext(BlockchainContext);
    const router = useRouter()

    useEffect(() => {
        setIsLoading(true)
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
        setIsLoading(false)
    }

    return (
        <section className={classes.wallets_page}>
            <Blur/>
            <h1>Manage your multisig wallets</h1>
            {!isLoading ? <div className="flex flex-wrap gap-4">
                    {userWallets?.length ?
                        userWallets.map((wallet) => {
                            return <WalletCard wallet={wallet} key={wallet.address}/>
                        })
                        : <div className="slow-fade-in-bottom">
                            <h2 className="text-3xl mb-10">You don't have any multisig wallets yet</h2>
                            <Button onClick={() => {
                                router.push('/create')
                            }}>Create new wallet</Button>
                        </div>}
                </div>
                :
                <div className={classes.loader_container}>
                    <Loader/>
                </div>
            }
        </section>
    )
}