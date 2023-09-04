import classes from './snackbar.module.scss'

export default function Snackbar({snackbarMessageType}: any) {
    function getMessage(): string {
        switch (snackbarMessageType) {
            case "copy":
                return "Copied to clipboard"

            case "lowBalance":
                return "Wallet's balance is too low"

            case "installMetamask":
                return "Please install Metamask"
            
            default:
                return ""
        }
    }

    return (
        <div className={classes.snackbar_container}>
            <p> {getMessage()} </p>
        </div>
    )
}
