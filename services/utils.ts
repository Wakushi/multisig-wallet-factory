function verifyAddresses(addresses: string[]): boolean {
    const isFormatValid = addresses.every((address) => {
        return address.length === 42 && address.startsWith('0x');
    });
    const areDuplicates = new Set(addresses).size !== addresses.length;
    return isFormatValid && !areDuplicates;
}

function saveMultiSigAddress(address: string): void {
    console.log('saving address', address)
    const addresses = JSON.parse(localStorage.getItem('address') || '[]');
    console.log("saved addresses", addresses)
    if (!addresses) {
        localStorage.setItem('address', address);
    } else {
        const curedAddresses = Array.from(new Set([...addresses, address]));
        localStorage.setItem('address', JSON.stringify(curedAddresses))
    }
}

export {verifyAddresses, saveMultiSigAddress};