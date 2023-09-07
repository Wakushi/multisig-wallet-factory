import classes from "./hero.module.scss";
import Image from "next/image";
import {useRouter} from "next/router";
import Button from "@/components/ui/button/button";
import Blur from "@/components/ui/blur/blur";
import heroImg from "@/assets/images/hero/together-hero.webp";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "@/services/UserContext";
import ShadowTransition from "@/components/ui/shadow-transition/shadow-transition";
import {handleGoToNextSection} from "@/services/utils";

export default function Hero() {

    const router = useRouter();
    const {walletAddress, connectWallet} = useContext(UserContext);
    const [scrollDistance, setScrollDistance] = useState(0);

    useEffect(() => {
        setScrollDistance(window.innerWidth > 900 ? 950 : 600)
    }, [])

    function goToCreatePage() {
        if (walletAddress) {
            router.push("/create");
        } else {
            connectWallet();
        }
    }

    return (
        <div className={`${classes.hero} flex justify-center items-center gap-5`}>
            <Blur/>
            <div className={`${classes.hero_text} flex flex-col z-1 gap-10`}>
                <h1 className={classes.hero_main_title}>Quickly create a multi-signature wallet in a few steps</h1>
                <p className={classes.hero_subtitle}>Manage your crypto assets with state-of-the-art security and user-friendly interface</p>
                <div className={classes.hero_actions}>
                    <Button filled={true} onClick={goToCreatePage}>Get started</Button>
                    <Button onClick={() => handleGoToNextSection(scrollDistance)}>How does it work ?</Button>
                </div>
            </div>
            <div className={classes.hero_image_container}>
                <Image className={classes.hero_image} src={heroImg} alt="A padlock"></Image>
            </div>
            <ShadowTransition/>
        </div>
    )
}