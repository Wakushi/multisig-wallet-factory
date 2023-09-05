import TutorialStep from "@/components/tutorial-step/tutorial-step";
import creationStepImg from "@/assets/images/tutorial-steps/creation-step.webp";
import walletsStepImg from "@/assets/images/tutorial-steps/manage-wallets-step.webp";
import transactionStepImg from "@/assets/images/tutorial-steps/transaction-step.webp";

export default function Tutorial() {
    return (
        <>
            <TutorialStep scrollPosition={1850}>
                <h2 id="tutorial_start" className="text-8xl text-center mb-16">What is a multi-sig wallet ?</h2>
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
                <div className="flex">
                    <h2 className="text-[4vw]">1.</h2>
                    <div>
                        <h2 className="text-[4vw] mb-4">Setup your wallet in a few seconds</h2>
                        <p className="text-3xl"><span className="font-bold">You</span> choose how many <span
                            className="font-bold">owners</span> and how many <span className="font-bold">confirmations</span> will be
                            required for each wallet you
                            create.</p>
                    </div>
                </div>
            </TutorialStep>
            <TutorialStep imgSrc={walletsStepImg} scrollPosition={3800}>
                <div className="flex">
                    <h2 className="text-[4vw]">2.</h2>
                    <div>
                        <h2 className="text-[3.7vw] mb-4">Easily manage all your wallets</h2>
                        <p className="text-3xl">A simple <span className="font-bold">interface</span> which displays all the <span
                            className="font-bold">wallets</span> where you are one of the <span className="font-bold">owners</span>.</p>
                    </div>
                </div>
            </TutorialStep>
            <TutorialStep imgSrc={transactionStepImg} scrollPosition={0}>
                <div className="flex">
                    <h2 className="text-[4vw]">3.</h2>
                    <div>
                        <h2 className="text-[4vw] mb-4">Create, confirm and execute transactions</h2>
                        <p className="text-3xl">Always keep an eye on all the current <span className="font-bold">transactions</span> and their <span
                            className="font-bold">details</span>.</p>
                    </div>
                </div>
            </TutorialStep>
        </>

    )
}