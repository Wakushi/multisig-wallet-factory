import classes from "./burger.module.scss"
import React, {useRef} from "react";

interface BurgerProps {
    handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Burger({handleClick}: BurgerProps) {

    const burgerRef = useRef<HTMLInputElement | null>(null)

    return (
        <div className={classes.burger}>
            <input className={classes.checkbox} type="checkbox" id="checkbox" ref={burgerRef} onClick={handleClick}></input>
            <label className={classes.toggle} htmlFor="checkbox">
                <div className={`${classes.bars} ${classes.bar1}`}></div>
                <div className={`${classes.bars} ${classes.bar2}`}></div>
                <div className={`${classes.bars} ${classes.bar3}`}></div>
            </label>
        </div>
    )

}