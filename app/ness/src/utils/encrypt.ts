const PBKDF2_ITERATIONS = 100000;

export async function getDailyKey(masterKey: string, keyDate: Date) {
    const year = keyDate.getFullYear();
    const month = String(keyDate.getMonth() + 1).padStart(2, '0');
    const day = String(keyDate.getDate()).padStart(2, '0');
    const salt = new TextEncoder().encode(`${year}-${month}-${day}`);
    const masterKeyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(masterKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
    );

    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        masterKeyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'],
    );
}

export async function decryptData(encryptedBase64: string, dailyKey: CryptoKey) {
    const cleanBase64 = encryptedBase64.trim();
    const encryptedBundle = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));
    const iv = encryptedBundle.slice(0, 12);
    const tag = encryptedBundle.slice(12, 28);
    const ciphertext = encryptedBundle.slice(28);
    const dataToDecrypt = new Uint8Array(ciphertext.length + tag.length);
    dataToDecrypt.set(ciphertext, 0);
    dataToDecrypt.set(tag, ciphertext.length);

    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        dailyKey,
        dataToDecrypt,
    );

    return new TextDecoder().decode(decryptedBuffer);
}
