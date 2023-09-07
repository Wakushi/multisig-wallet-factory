import classes from "./header.module.scss";
import Link from "next/link";
import Button from "@/components/ui/button/button";
import {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "@/services/UserContext";
import Image from "next/image";
import metamask from "@/assets/images/logo/metamask-logo.png";
import together from "@/assets/images/logo/together-logo.png";
import {useRouter} from "next/router";
import {getShortenedAddress} from "@/services/utils";
import Burger from "@/components/ui/burger/burger";
import {Properties} from "csstype";

export default function Header() {

    const {walletAddress, connectWallet} = useContext(UserContext)
    const shortenWalletAddress = walletAddress ? getShortenedAddress(walletAddress) : null
    const headerRef = useRef<HTMLHeadElement | null>(null)
    const [displayMiniNav, setDisplayMiniNav] = useState(false)
    const router = useRouter()


    const smallNavStyles: Properties = {
        opacity: displayMiniNav ? 1 : 0,
        transform: displayMiniNav ? "translateY(0%)" : "",
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current) return;
            if (window.scrollY > 0) {
                headerRef.current.classList.add(classes.header_scrolled);
            } else {
                headerRef.current.classList.remove(classes.header_scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },);


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

    function handleBurgerToggle() {
        setDisplayMiniNav(preDisplayMiniNav => !preDisplayMiniNav)
    }

    return <header className={classes.header} ref={headerRef}>
        <div className={`${classes.logo_container} flex items-center cursor-pointer`} onClick={() => {
            router.push("/")
        }}>
            <div className="logo-img-container">
                <Image src={together} alt="TogEther Logo" width={40} height={40}/>
            </div>
            <div className={classes.logo_text}><span>tog</span><span className={classes.logo_special}>ether</span></div>
        </div>
        <nav className={`${classes.nav_bar} flex items-center gap-4`}>
            <ul className="flex items-center gap-14">
                <li className={classes.nav_link} tabIndex={0} onClick={() => handleConnectionPriorRouting('/create')}>Create</li>
                <li className={classes.nav_link} tabIndex={0} onClick={() => handleConnectionPriorRouting('/wallets')}>Manage</li>
                <li className={classes.nav_link} tabIndex={0}><Link href="https://ethereum.org/fr/">Ethereum ?</Link></li>
                <li><Button onClick={connectWallet}>
                    {walletAddress ?
                        <>
                            <Image src={metamask} alt="Metamask Logo" width={40} height={40}/> {shortenWalletAddress}
                        </>
                        : "Connect wallet"
                    }
                </Button>
                </li>
            </ul>
            <Burger handleClick={handleBurgerToggle}/>
        </nav>
        <nav style={smallNavStyles} className={`${classes.small_nav_bar} flex items-center gap-4`}>
            <ul className="flex items-center gap-8">
                <li className={classes.nav_link} tabIndex={0} onClick={() => handleConnectionPriorRouting('/create')}>Create</li>
                <li className={classes.nav_link} tabIndex={0} onClick={() => handleConnectionPriorRouting('/wallets')}>Manage</li>
                <li className={classes.wallet_button}>
                    <Button onClick={connectWallet}>
                        {walletAddress ?
                            <>
                                <Image src={metamask} alt="Metamask Logo" width={40} height={40}/> {shortenWalletAddress}
                            </>
                            : "Connect wallet"
                        }
                    </Button>
                </li>
            </ul>
        </nav>
    </header>
}