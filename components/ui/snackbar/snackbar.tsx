import classes from './snackbar.module.scss'

export default function Snackbar({snackbarMessageType}: any) {
    function getMessage(): string {
        switch (snackbarMessageType) {
            case "copy":
                return "Copied to clipboard"

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
