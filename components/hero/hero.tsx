import classes from "./hero.module.scss";
import Image from "next/image";
import {useRouter} from "next/router";
import Button from "@/components/ui/button/button";
import Blur from "@/components/ui/blur/blur";
import heroImg from "@/assets/images/hero/together-hero.webp";
import {useContext} from "react";
import {UserContext} from "@/services/UserContext";

export default function Hero() {

    const router = useRouter();
    const {walletAddress, connectWallet} = useContext(UserContext);

    function goToCreatePage() {
        if (walletAddress) {
            router.push("/create");
        } else {
            connectWallet();
        }
    }

    function handleGoToDetails() {
        console.log("How does it work ?")
    }

    return (
        <div className={`${classes.hero} flex justify-center items-center gap-5`}>
            <Blur/>
            <div className={`${classes.hero_text} flex flex-col z-1 gap-10`}>
                <h1 className="text-7xl">Quickly create a multi-signature wallet in a few steps</h1>
                <p className="text-3xl">Manage your crypto assets with state-of-the-art security and user-friendly interface</p>
                <div className="flex items-center gap-3.5">
                    <Button filled={true} onClick={goToCreatePage}>Get started</Button>
                    <Button onClick={handleGoToDetails}>How does it work ?</Button>
                </div>
            </div>
            <div className={classes.hero_image_container}>
                <Image className={classes.hero_image} src={heroImg} alt="A padlock"></Image>
            </div>
        </div>
    )
}