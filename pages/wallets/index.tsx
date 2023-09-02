import Blur from "@/components/ui/blur/blur";
import classes from "./wallets.module.scss";
import {useEffect, useState} from "react";
import {BaseContract, ethers} from "ethers";
import {multiSigWalletAbi} from "@/services/constants";

interface MultiSigWalletContract extends BaseContract {
    getOwners(): Promise<void>

    // ... other methods and properties
}

interface Wallet {
    address: string
    owners: string[]
}

export default function WalletsPage() {

    // 0xFC3cF2AC95032f0043769113f8Aa1a43a41335d5
    // 0x04a4e427c147f4786Ef939A5c2d3DC1F25861AF9

    const [wallets, setWallets] = useState<Wallet[]>()

    useEffect(() => {
        getWallets()
    }, [])

    async function getWallets() {
        const userWallets = JSON.parse(localStorage.getItem('address') || '[]');
        if (userWallets && userWallets.length) {
            const allWallets: Wallet[] = await Promise.all(userWallets.map(async (walletAddress: string) => {
                const cleanedMultiSigAddress = getCleanedMultiSigAddress(walletAddress);
                const walletOwners = await getOwners(cleanedMultiSigAddress);
                return {
                    address: cleanedMultiSigAddress,
                    owners: walletOwners
                };
            }));
            setWallets(prevWallets => {
                const existingAddresses = new Set((prevWallets || []).map(wallet => wallet.address));
                const newWallets = allWallets.filter(wallet => !existingAddresses.has(wallet.address));
                return [...(prevWallets || []), ...newWallets];
            });

        }
    }


    function getCleanedMultiSigAddress(walletAddress: string) {
        return walletAddress.replace(/['"]+/g, '');
    }

    async function getOwners(multiSigAddress: string) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(multiSigAddress, multiSigWalletAbi, provider)
            try {
                const transactionResponse = await contract.getOwners()
                return transactionResponse
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    return (
        <section className={classes.wallets_page}>
            <h1>Manage your multisig wallets</h1>
            <div className="flex flex-wrap gap-4">
                {wallets && wallets.map((wallet) => {
                    return (
                        <article key={wallet.address} className={classes.wallet_card}>
                            <h2>Wallet</h2>
                            <p>{wallet.address}</p>
                            <h3>Owners</h3>
                            <ul>
                                {wallet.owners && wallet.owners.map((owner) => {
                                    return <li key={owner}>{owner}</li>
                                })}
                            </ul>
                            <i className="fa-solid fa-angles-right"></i>
                        </article>)
                })}
            </div>
            <Blur/>
        </section>
    )
}