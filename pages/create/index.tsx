import classes from "./create.module.scss";
import {useContext, useEffect, useState} from "react";
import Blur from "@/components/ui/blur/blur";
import Button from "@/components/ui/button/button";
import WaitingModal from "@/components/waiting-modal/waiting-modal";
import {BlockchainContext} from "@/services/BlockchainContext";
import {ErrorContext} from "@/services/ErrorContext";
import {UserContext} from "@/services/UserContext";

export default function CreatePage() {

    const [ownersAddresses, setOwnersAddresses] = useState<string[]>(["", ""])
    const [numberOfConfirmation, setNumberOfConfirmation] = useState<number>(2)
    const {createMultiSigWallet, isWaitingForTransaction} = useContext(BlockchainContext);
    const {handleCreationFormError, errorMsg, setErrorMsg} = useContext(ErrorContext)

    function handleAddOwnerInputField() {
        setOwnersAddresses(prevOwnersAddresses => [...prevOwnersAddresses, ""])
    }

    function handleRemoveOwnerInputField(index: number) {
        setOwnersAddresses(prevOwnersAddresses => {
            const newOwnersInput = [...prevOwnersAddresses]
            newOwnersInput.splice(index, 1)
            return newOwnersInput
        })
    }

    function handleOnOwnerInputChange(index: number, newAddress: string) {
        setOwnersAddresses(prevOwnersAddresses => {
            const newOwnersAddresses = [...prevOwnersAddresses];
            newOwnersAddresses[index] = newAddress;
            return newOwnersAddresses;
        });
    }

    function handleOnConfirmationInputChange(numberOfConfirmation: number) {
        setNumberOfConfirmation(numberOfConfirmation)
    }

    function handleSubmit() {
        if (!handleCreationFormError(ownersAddresses, numberOfConfirmation)) {
            return
        } else {
            createMultiSigWallet(ownersAddresses, numberOfConfirmation)
        }
    }

    return (
        <>
            <section className={`${classes.create} flex flex-col fade-in-bottom brand-container`}>
                <Blur/>
                <h1>Create your multisig wallet</h1>
                <p>Please enter the number of confirmations required for every future transaction of this wallet.</p>
                <div className="flex">
                    <span>Every transaction will require </span>
                    <div className={classes.confirmation_input}>
                        <input type="number" placeholder="2" min="2" onChange={(e) => handleOnConfirmationInputChange(+e.target.value)}/>
                    </div>
                    <span>owner confirmations.</span>

                </div>
                <p className={classes.small_text}>Note : there should be at least two owners minimum, and two confirmation required minimum.</p>
                <p>Please enter the owners address.</p>
                <div className={`${classes.owners_input_list} flex flex-wrap items-center gap-4`}>
                    {ownersAddresses.map((address, index) => {
                        return (
                            <div key={index} className={`${classes.owner_input} dark_input`}>
                                {index > 1 &&
                                    <i className="fa-solid fa-circle-minus" onClick={() => handleRemoveOwnerInputField(index)}></i>
                                }
                                <input
                                    value={address}
                                    type="text"
                                    placeholder="0x00..."
                                    onChange={(e) => handleOnOwnerInputChange(index, e.target.value)}
                                />
                            </div>
                        )
                    })}
                    <i className="fa-solid fa-plus" onClick={handleAddOwnerInputField}></i>
                </div>
                <div className="flex items-center justify-between">
                    {errorMsg && <span className="text-rose-600">{errorMsg}</span>}
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </section>
            {isWaitingForTransaction &&
                <WaitingModal>Creating your multisig wallet...</WaitingModal>
            }
        </>
    )
}