
export const loadPanoramaAsBlob = async (url: string): Promise<string> => {
    // For local files, we might not need this if we just pass the URL to the viewer.
    // But if we want to prefetch, we can fetch as blob and create object URL.
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (e) {
        console.error("Failed to load panorama", url, e);
        throw e;
    }
};

export const prefetchPanorama = (url: string) => {
    const img = new Image();
    img.src = url;
};
