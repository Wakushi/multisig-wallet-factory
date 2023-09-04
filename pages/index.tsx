import Hero from "@/components/hero/hero";
import classes from "./home.module.scss"
import Blur from "@/components/ui/blur/blur";
import ShadowTransition from "@/components/ui/shadow-transition/shadow-transition";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import creationStepImg from "@/assets/images/tutorial-steps/creation-step.png"
import walletsStepImg from "@/assets/images/tutorial-steps/manage-wallets-step.png"
import transactionStepImg from "@/assets/images/tutorial-steps/transaction-step.png"
import {handleGoToNextSection} from "@/services/utils";

export default function Home() {

    const [displayDescriptionSection, setDisplayDescriptionSection] = useState<boolean>(false)
    const [displayCreationStepSection, setDisplayCreationStepSection] = useState<boolean>(false)
    const [displayManageWalletStepSection, setDisplayManageWalletStepSection] = useState<boolean>(false)
    const [displayTransactionStepSection, setDisplayTransactionStepSection] = useState<boolean>(false)

    const multisigDescriptionRef = useRef<HTMLDivElement | null>(null)
    const creationStepRef = useRef<HTMLDivElement | null>(null)
    const manageWalletsRef = useRef<HTMLDivElement | null>(null)
    const transactionStepRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (multisigDescriptionRef.current) {
                const positionInfo = multisigDescriptionRef.current.getBoundingClientRect().y;
                if (positionInfo < 150) {
                    setDisplayDescriptionSection(true)
                } else if (positionInfo > 700) {
                    setDisplayDescriptionSection(false)
                }
            }
            if (creationStepRef.current) {
                const positionInfo = creationStepRef.current.getBoundingClientRect().y;
                if (positionInfo < 150) {
                    setDisplayCreationStepSection(true)
                } else if (positionInfo > 700) {
                    setDisplayCreationStepSection(false)
                }
            }
            if (manageWalletsRef.current) {
                const positionInfo = manageWalletsRef.current.getBoundingClientRect().y;
                if (positionInfo < 150) {
                    setDisplayManageWalletStepSection(true)
                } else if (positionInfo > 700) {
                    setDisplayManageWalletStepSection(false)
                }
            }
            if (transactionStepRef.current) {
                const positionInfo = transactionStepRef.current.getBoundingClientRect().y;
                if (positionInfo < 150) {
                    setDisplayTransactionStepSection(true)
                } else if (positionInfo > 700) {
                    setDisplayTransactionStepSection(false)
                }
            }
        })
    }, [])

    return (
        <>
            <Hero/>
            <section className={`${classes.multisig_description} flex justify-center items-center gap-5`} ref={multisigDescriptionRef}>
                {displayDescriptionSection &&
                    <div className={`${classes.multisig_description_content} flex flex-col justify-center items-center gap-8 fade-in-right`}>
                        <h2 className="text-8xl mb-4">What is a multi-sig wallet ?</h2>
                        <p className="text-3xl fade-in-right">A multisig wallet on Ethereum is a digital wallet that requires multiple private
                            keys to
                            authorize a
                            transaction. </p>
                        <p className="text-3xl fade-in-right">Instead of one person having full control, multiple people must approve a transaction,
                            adding an extra layer of security.
                        </p>
                        <i className="fa-solid fa-angles-down hover" onClick={() => handleGoToNextSection(1850)}></i>
                    </div>}
                <Blur/>
                <ShadowTransition reversed={true}/>
                <ShadowTransition/>
            </section>
            <section className={`${classes.creation_step_container} flex justify-center items-center gap-5`} ref={creationStepRef}>
                {displayCreationStepSection &&
                    <div className={`${classes.creation_step_content} flex flex-col gap-40`}>
                        <div className={`${classes.creation_step_content} flex justify-center items-center gap-8 fade-in-right`}>
                            <div>
                                <h2 className="text-7xl mb-4">1. Setup your wallet in a few seconds</h2>
                                <p className="text-3xl"><span className="font-bold">You</span> choose how many <span
                                    className="font-bold">owners</span> and how many <span className="font-bold">confirmations</span> will be
                                    required for each wallet you
                                    create.</p>

                            </div>
                            <div>
                                <div className={classes.creation_step_img_container}>
                                    <Image src={creationStepImg} alt="Creation step"></Image>
                                </div>
                            </div>
                        </div>
                        <i className="fa-solid fa-angles-down hover" onClick={() => handleGoToNextSection(2850)}></i>
                    </div>}
                <Blur/>
                <ShadowTransition reversed={true}/>
                <ShadowTransition/>
            </section>
            <section className={`${classes.manage_wallets_step_container} flex justify-center items-center gap-5`} ref={manageWalletsRef}>
                {displayManageWalletStepSection &&
                    <div className="flex flex-col items-center gap-40">
                        <div className={`${classes.manage_wallets_content} flex justify-center items-center gap-8 fade-in-right`}>
                            <div className="flex-1">
                                <h2 className="text-7xl mb-4">2. Easily manage all your wallets</h2>
                                <p className="text-3xl">A simple interface which displays all the wallets where you are one of the owners.</p>

                            </div>
                            <div className="flex-1">
                                <div className={classes.wallet_step_img_container}>
                                    <Image src={walletsStepImg} alt="Wallet managment step"></Image>
                                </div>
                            </div>
                        </div>
                        <i className="fa-solid fa-angles-down hover" onClick={() => handleGoToNextSection(3900)}></i>
                    </div>}
                <Blur/>
                <ShadowTransition reversed={true}/>
                <ShadowTransition/>
            </section>
            <section className={`${classes.transaction_step_container} flex justify-center items-center gap-5`} ref={transactionStepRef}>
                {displayTransactionStepSection &&
                    <div className="flex flex-col items-center gap-36">
                        <div className={`${classes.transaction_step_content} flex justify-center items-center gap-8 fade-in-right`}>
                            <div className="flex-1">
                                <h2 className="text-7xl mb-4">3. Create, confirm and execute transactions</h2>
                                <p className="text-3xl">Always keep an eye on all the current transactions and their details.</p>

                            </div>
                            <div className="flex-1">
                                <div className={classes.transaction_step_img_container}>
                                    <Image src={transactionStepImg} alt="Transaction managment step"></Image>
                                </div>
                            </div>
                        </div>
                        <i className="fa-solid fa-angles-up hover" onClick={() => handleGoToNextSection(0)}></i>
                    </div>}
                <Blur/>
                <ShadowTransition reversed={true}/>
            </section>
        </>
    )
}
