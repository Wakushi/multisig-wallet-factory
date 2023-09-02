import Blur from "@/components/ui/blur/blur";
import classes from "./create.module.scss";
import {useContext, useState} from "react";
import Button from "@/components/ui/button/button";
import {areAddressesValid} from "@/services/utils";
import WaitingModal from "@/components/waiting-modal/waiting-modal";
import {useRouter} from "next/router";
import {BlockchainContext} from "@/services/BlockchainContext";

export default function CreatePage() {

    const [ownersAddresses, setOwnersAddresses] = useState<string[]>(["", ""])
    const [numberOfConfirmation, setNumberOfConfirmation] = useState<number>(2)
    const {createMultiSigWallet, setAreAddressesValidated, areAddressesValidated, isWaitingForTransaction} = useContext(BlockchainContext);

    function handleAddOwnerInput() {
        setOwnersAddresses(prevOwnersAddresses => [...prevOwnersAddresses, ""])
    }

    function handleRemoveOwnerInput(index: number) {
        setOwnersAddresses(prevOwnersAddresses => {
            const newOwnersInput = [...prevOwnersAddresses]
            newOwnersInput.splice(index, 1)
            return newOwnersInput
        })
    }

    function handleOwnerInput(index: number, newAddress: string) {
        setAreAddressesValidated(true)
        setOwnersAddresses(prevOwnersAddresses => {
            const newOwnersInput = [...prevOwnersAddresses];
            newOwnersInput[index] = newAddress;
            return newOwnersInput;
        });
    }

    function handleConfirmationInput(numberOfConfirmation: number) {
        setNumberOfConfirmation(numberOfConfirmation)
    }

    function handleSubmit() {
        if (!areAddressesValid(ownersAddresses) || numberOfConfirmation < 2 || numberOfConfirmation > ownersAddresses.length) {
            setAreAddressesValidated(false)
        } else {
            createMultiSigWallet(ownersAddresses, numberOfConfirmation)
        }
    }

    return (
        <>
            <section className={`${classes.create} flex flex-col`}>
                <Blur/>
                <h1>Create your multisig wallet</h1>
                <p>Please enter the number of confirmations required for every future transaction of this wallet.</p>
                <div className="flex">
                    <span>Every transaction will require </span>
                    <div className={classes.confirmation_input}>
                        <input type="number" placeholder="2" min="2" onChange={(e) => handleConfirmationInput(+e.target.value)}/>
                    </div>
                    <span>owner confirmations.</span>

                </div>
                <p className={classes.small_text}>Note : there should be at least two owners minimum, and two confirmation required minimum.</p>
                <p>Please enter the owners address.</p>
                <div className={`${classes.owners_input_list} flex flex-wrap items-center gap-4`}>
                    {ownersAddresses.map((address, index) => {
                        return (
                            <div key={index} className={classes.owner_input}>
                                {index > 1 &&
                                    <i className="fa-solid fa-circle-minus" onClick={() => handleRemoveOwnerInput(index)}></i>
                                }
                                <input
                                    value={address}
                                    type="text"
                                    placeholder="0x00..."
                                    onChange={(e) => handleOwnerInput(index, e.target.value)}
                                />
                            </div>
                        )
                    })}
                    <i className="fa-solid fa-plus" onClick={handleAddOwnerInput}></i>
                </div>
                <div className="flex items-center justify-between">
                    {!areAddressesValidated && <span className="text-rose-600">Please verify all addresses format.</span>}
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </section>
            {isWaitingForTransaction &&
                <WaitingModal>Creating your multisig wallet...</WaitingModal>
            }
        </>
    )
}