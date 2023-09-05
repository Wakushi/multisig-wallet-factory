import {ReactNode, useEffect, useRef, useState} from "react";
import classes from "./tutorial-step.module.scss";
import Image, {StaticImageData} from "next/image";
import {handleGoToNextSection} from "@/services/utils";
import Blur from "@/components/ui/blur/blur";
import ShadowTransition from "@/components/ui/shadow-transition/shadow-transition";

interface TutorialStepProps {
    children: ReactNode
    scrollPosition: number
    imgSrc?: StaticImageData
}

export default function TutorialStep({children, imgSrc, scrollPosition}: TutorialStepProps) {

    const [displayTutorialStep, setDisplayTutorialStep] = useState<boolean>(false)
    const tutorialStepRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (tutorialStepRef.current) {
                const positionInfo = tutorialStepRef.current.getBoundingClientRect().y;
                if (positionInfo < 150) {
                    setDisplayTutorialStep(true)
                } else if (positionInfo > 700) {
                    setDisplayTutorialStep(false)
                }
            }
        })
    }, [])

    return (
        <section className={`${classes.tutorial_step_container} flex justify-center items-center gap-5`} ref={tutorialStepRef}>
            {displayTutorialStep &&
                <div className="flex flex-col items-center gap-40">
                    <div className={`${classes.tutorial_step_content} flex justify-center items-center gap-8 fade-in-right`}>
                        <div>
                            {children}
                        </div>
                        {imgSrc && <div>
                            <div className={classes.tutorial_step_img_container}>
                                <Image src={imgSrc} alt="Tutorial step"></Image>
                            </div>
                        </div>}
                    </div>
                    <i className={`fa-solid fa-angles-${scrollPosition > 0 ? 'down' : 'up'} hover`}
                       onClick={() => handleGoToNextSection(scrollPosition)}></i>
                </div>}
            <Blur/>
            <ShadowTransition reversed={true}/>
            <ShadowTransition/>
        </section>
    )
}