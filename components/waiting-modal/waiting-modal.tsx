import classes from "./waiting-modal.module.scss";
import Loader from "@/components/ui/loader/loader";

interface WaitingModalProps {
    children: React.ReactNode;
}

export default function WaitingModal(props: WaitingModalProps) {
    return (
        <div className={classes.modal_container}>
            <div className={classes.modal_inner}>
                <p>
                    {props.children}
                </p>
                <Loader/>
            </div>
        </div>
    )
}