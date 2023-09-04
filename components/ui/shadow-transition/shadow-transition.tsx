import classes from "./shadow-transition.module.scss";

interface ShadowTransitionProps {
    reversed?: boolean;
}

export default function ShadowTransition(props: ShadowTransitionProps) {
    return (
        <>
            <div className={`${props.reversed ? classes.shadow_transition_reversed : classes.shadow_transition}`}></div>
        </>
    );
}