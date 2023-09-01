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
        className={`${classes.button} ${props.filled ? "" : ""}`}>
        {props.children}
    </button>
}