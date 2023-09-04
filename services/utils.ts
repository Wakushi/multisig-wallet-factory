function saveMultiSigAddress(address: string): void {
    const addresses = JSON.parse(localStorage.getItem('address') || '[]');
    if (!addresses) {
        localStorage.setItem('address', address);
    } else {
        const curedAddresses = Array.from(new Set([...addresses, address]));
        localStorage.setItem('address', JSON.stringify(curedAddresses))
    }
}

function getShortenedAddress(address: string): string {
    return address ? address.slice(0, 6) + "..." + address.slice(-4) : address
}

function handleGoToNextSection(position: number) {
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    })
}

export {saveMultiSigAddress, getShortenedAddress, handleGoToNextSection};