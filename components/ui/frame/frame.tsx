import classes from "./frame.module.scss"

export default function Frame() {
    return (
        <>
            <div className={classes.corner_top_left}></div>
            <div className={classes.corner_top_right}></div>
            <div className={classes.corner_bottom_left}></div>
            <div className={classes.corner_bottom_right}></div>
            <div className={classes.plus_container_top}>
                <div className={classes.plus_bar_1}></div>
                <div className={classes.plus_bar_2}></div>
            </div>
            <div className={classes.plus_container_bottom}>
                <div className={classes.plus_bar_1}></div>
                <div className={classes.plus_bar_2}></div>
            </div>
        </>
    )
}
