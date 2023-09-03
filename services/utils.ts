function areAddressesValid(addresses: string[]): boolean {
    const isFormatValid = addresses.every((address) => {
        return address.length === 42 && address.startsWith('0x');
    });
    const areDuplicates = new Set(addresses).size !== addresses.length;
    return isFormatValid && !areDuplicates;
}

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

export {areAddressesValid, saveMultiSigAddress, getShortenedAddress};