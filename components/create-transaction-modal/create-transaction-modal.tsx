import classes from "./create-transaction-modal.module.scss";
import Button from "@/components/ui/button/button";

interface CreateTransactionModalProps {
    handleToggleModal: ({target}: any) => void;
    handleTransactionFormSubmit: (event: any) => void;
    isFormValid: boolean;
    txTo: any;
    txValue: any;
    txData: any;
}

export default function CreateTransactionModal({
                                                   handleToggleModal,
                                                   handleTransactionFormSubmit,
                                                   isFormValid,
                                                   txTo,
                                                   txValue,
                                                   txData
                                               }: CreateTransactionModalProps) {
    return (
        <div id="modal-container" className={classes.create_transaction_modal} onClick={handleToggleModal}>
            <div className={classes.create_transaction_modal_inner}>
                <i id="modal-close-btn" className="fa-solid fa-xmark"></i>
                <h2>Create a new transaction</h2>
                <form className="flex flex-col gap-4">
                    <label htmlFor="to">To</label>
                    <div className="dark_input">
                        <input type="text" id="to" name="to" ref={txTo}/>
                    </div>
                    <label htmlFor="amount">Amount</label>
                    <div className="dark_input">
                        <input type="text" id="amount" name="amount" ref={txValue}/>
                    </div>
                    <label htmlFor="data">Data</label>
                    <div className="dark_input">
                        <input type="text" id="data" name="data" ref={txData}/>
                    </div>
                    {!isFormValid && <span className="text-rose-600">Please verify that all values are correct.</span>}
                    <Button onClick={handleTransactionFormSubmit}>Submit</Button>
                </form>
            </div>
        </div>
    )
}