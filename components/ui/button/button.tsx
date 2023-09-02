import React from "react";
import classes from "./button.module.scss";

interface ButtonProps {
    children: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    filled?: boolean;
}

export default function Button(props: ButtonProps) {
    return <button
        onClick={props.onClick}
        className={`${props.filled ? classes.button : classes.button_empty}`}>
        {props.children}
    </button>
}