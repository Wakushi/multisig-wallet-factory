import classes from "./waiting-modal.module.scss";
import Loader from "@/components/ui/loader/loader";

export default function WaitingModal() {
    return (
        <div className={classes.modal_container}>
            <div className={classes.modal_inner}>
                <p>Creating your multisig wallet...</p>
                <Loader/>
            </div>
        </div>
    )
}