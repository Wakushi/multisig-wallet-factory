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
import TutorialStep from "@/components/tutorial-step/tutorial-step";

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
            <TutorialStep scrollPosition={1850}>
                <h2 className="text-8xl mb-4">What is a multi-sig wallet ?</h2>
                <p className="text-3xl text-center fade-in-right">A multisig wallet on Ethereum is a digital wallet that requires multiple private
                    keys to
                    authorize a
                    transaction. </p>
                <p className="text-3xl text-center fade-in-right">Instead of one person having full control, multiple people must approve a
                    transaction,
                    adding an extra layer of security.
                </p>
            </TutorialStep>
            <TutorialStep imgSrc={creationStepImg} scrollPosition={2850}>
                <h2 className="text-7xl mb-4">1. Setup your wallet in a few seconds</h2>
                <p className="text-3xl"><span className="font-bold">You</span> choose how many <span
                    className="font-bold">owners</span> and how many <span className="font-bold">confirmations</span> will be
                    required for each wallet you
                    create.</p>
            </TutorialStep>
            <TutorialStep imgSrc={walletsStepImg} scrollPosition={3800}>
                <h2 className="text-7xl mb-4">2. Easily manage all your wallets</h2>
                <p className="text-3xl">A simple interface which displays all the wallets where you are one of the owners.</p>
            </TutorialStep>
            <TutorialStep imgSrc={transactionStepImg} scrollPosition={0}>
                <h2 className="text-7xl mb-4">3. Create, confirm and execute transactions</h2>
                <p className="text-3xl">Always keep an eye on all the current transactions and their details.</p>
            </TutorialStep>
        </>
    )
}
