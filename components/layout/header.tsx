import classes from "./header.module.scss";
import Link from "next/link";
import Button from "@/components/ui/button/button";
import {useContext, useEffect, useRef} from "react";
import {UserContext} from "@/services/UserContext";
import Image from "next/image";
import metamask from "@/assets/images/logo/metamask-logo.png";
import together from "@/assets/images/logo/together-logo.png";

export default function Header() {

    const {walletAddress, connectWallet} = useContext(UserContext)
    const shortenWalletAddress = walletAddress ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : null
    const headerRef = useRef<HTMLHeadElement | null>(null)

    useEffect(() => {
        window.addEventListener('scroll', function () {
            if (!headerRef.current) return
            if (window.scrollY > 0) {
                headerRef.current.classList.add(classes.header_scrolled)
            } else {
                headerRef.current.classList.remove(classes.header_scrolled)
            }
        })
    })

    return <header className={classes.header} ref={headerRef}>
        <div className="logo flex items-center">
            <div className="logo-img-container">
                <Image src={together} alt="TogEther Logo" width={40} height={40}/>
            </div>
            <div className={classes.logo_text}><span>tog</span><span className={classes.logo_special}>ether</span></div>
        </div>
        <nav>
            <ul className="flex items-center gap-14">
                <li className={classes.nav_link}><Link href="/">Create</Link></li>
                <li className={classes.nav_link}><Link href="/">Solutions</Link></li>
                <li className={classes.nav_link}><Link href="/">About</Link></li>
                <Button onClick={connectWallet}>
                    {walletAddress ?
                        <>
                            <Image src={metamask} alt="Metamask Logo" width={40} height={40}/> {shortenWalletAddress}
                        </>
                        : "Connect wallet"
                    }
                </Button>
            </ul>
        </nav>
    </header>
}