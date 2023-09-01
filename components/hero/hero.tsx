import classes from "./hero.module.scss";
import Image from "next/image";
import padlock from "@/assets/images/hero/hero-padlock.webp";
import Button from "@/components/ui/button/button";

export default function Hero() {

    function handleGetStarted() {
        console.log("Get started")
    }

    function handleGoToDetails() {
        console.log("How does it work ?")
    }

    return (
        <div className={`${classes.hero} flex justify-center items-center gap-5`}>
            <span className={classes.hero_blur}></span>
            <div className={`${classes.hero_text} flex flex-col z-1 gap-10`}>
                <h1 className="text-7xl">Quickly create a multi-signature wallet in a few steps</h1>
                <p className="text-3xl">Manage your crypto assets with state-of-the-art security and user-friendly interface</p>
                <div className="flex items-center gap-3.5">
                    <Button onClick={handleGetStarted}>Get started</Button>
                    <Button onClick={handleGoToDetails}>How does it work ?</Button>
                </div>
            </div>
            <div className={classes.hero_image_container}>
                <Image className={classes.hero_image} src={padlock} alt="A padlock"></Image>
            </div>
        </div>
    )
}