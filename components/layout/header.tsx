import classes from "./header.module.scss";
import Link from "next/link";
import Button from "@/components/ui/button/button";
import {useContext, useEffect, useRef} from "react";
import {UserContext} from "@/services/UserContext";
import Image from "next/image";
import metamask from "@/assets/images/logo/metamask-logo.png";
import together from "@/assets/images/logo/together-logo.png";
import {useRouter} from "next/router";
import {getShortenedAddress} from "@/services/utils";

export default function Header() {

    const {walletAddress, connectWallet} = useContext(UserContext)
    const shortenWalletAddress = walletAddress ? getShortenedAddress(walletAddress) : null
    const headerRef = useRef<HTMLHeadElement | null>(null)
    const router = useRouter()

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

    async function handleConnectionPriorRouting(route: string) {
        if (!walletAddress) {
            const account = await connectWallet()
            if (account) {
                router.push(route)
            }
        } else {
            router.push(route)
        }
    }

    return <header className={classes.header} ref={headerRef}>
        <div className="logo flex items-center cursor-pointer" onClick={() => {
            router.push("/")
        }}>
            <div className="logo-img-container">
                <Image src={together} alt="TogEther Logo" width={40} height={40}/>
            </div>
            <div className={classes.logo_text}><span>tog</span><span className={classes.logo_special}>ether</span></div>
        </div>
        <nav>
            <ul className="flex items-center gap-14">
                <li className={classes.nav_link} tabIndex={0} onClick={() => handleConnectionPriorRouting('/create')}>Create</li>
                <li className={classes.nav_link} tabIndex={0} onClick={() => handleConnectionPriorRouting('/wallets')}>Manage</li>
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