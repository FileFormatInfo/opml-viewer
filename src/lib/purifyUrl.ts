function purifyUrl(url: string): string|undefined {

    if (!url) {
        return undefined;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return undefined;
}

export { purifyUrl };