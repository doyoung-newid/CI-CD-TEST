async function copyToClipboard(text: string, onSuccess?: () => void): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        onSuccess?.();
    } catch (e) {
        console.error('Copy failed', e);
    }
}

export { copyToClipboard };
