import TutorialStep from "@/components/tutorial-step/tutorial-step";
import creationStepImg from "@/assets/images/tutorial-steps/creation-step.webp";
import walletsStepImg from "@/assets/images/tutorial-steps/manage-wallets-step.webp";
import transactionStepImg from "@/assets/images/tutorial-steps/transaction-step.webp";

export default function Tutorial() {
    return (
        <>
            <TutorialStep scrollPosition={1850}>
                <h2 className="text-8xl text-center mb-16">What is a multi-sig wallet ?</h2>
                <p className="text-3xl text-center fade-in-right max-w-4xl mb-5">A multisig wallet on Ethereum is a digital wallet that requires
                    multiple
                    private
                    keys to
                    authorize a
                    transaction. </p>
                <p className="text-3xl text-center fade-in-right max-w-4xl">Instead of one person having full control, multiple people must
                    approve a
                    transaction,
                    adding an extra layer of security.
                </p>
            </TutorialStep>
            <TutorialStep imgSrc={creationStepImg} scrollPosition={2850}>
                <h2 className="text-[4vw] mb-4">1. Setup your wallet in a few seconds</h2>
                <p className="text-3xl"><span className="font-bold">You</span> choose how many <span
                    className="font-bold">owners</span> and how many <span className="font-bold">confirmations</span> will be
                    required for each wallet you
                    create.</p>
            </TutorialStep>
            <TutorialStep imgSrc={walletsStepImg} scrollPosition={3800}>
                <h2 className="text-[4vw] mb-4">2. Easily manage all your wallets</h2>
                <p className="text-3xl">A simple interface which displays all the wallets where you are one of the owners.</p>
            </TutorialStep>
            <TutorialStep imgSrc={transactionStepImg} scrollPosition={0}>
                <h2 className="text-[4vw] mb-4">3. Create, confirm and execute transactions</h2>
                <p className="text-3xl">Always keep an eye on all the current transactions and their details.</p>
            </TutorialStep>
        </>

    )
}