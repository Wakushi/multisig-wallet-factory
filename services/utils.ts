function getShortenedAddress(address: string): string {
    return address ? address.slice(0, 6) + "..." + address.slice(-4) : address
}

function handleGoToNextSection(position: number) {
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    })
}

export {getShortenedAddress, handleGoToNextSection};