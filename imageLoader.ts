// This file will manage loading image assets.
// For now, we'll manually list the paths. In a real project with a build server,
// a script could automatically generate this list.

// TODO: Add the paths to your PNG files here.
// Make sure the path starts with a `/` and points to the `assets` folder.
export const imagePaths: string[] = [
    '/assets/embrune_splash.png',
];

/**
 * Converts a Blob (like an image file) to a Base64 data URL.
 * @param blob The blob to convert.
 * @returns A promise that resolves with the data URL string.
 */
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error("FileReader did not return a string."));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Takes an array of image URLs, fetches them, and converts them to a map of
 * filename -> base64 data URL.
 * @param paths An array of strings, where each string is a path to an image.
 * @returns A promise that resolves to a Record<string, string>.
 */
export async function loadImagesAsBase64(paths: string[]): Promise<Record<string, string>> {
    const assetMap: Record<string, string> = {};

    const promises = paths.map(async (path) => {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for path ${path}`);
            }
            const blob = await response.blob();
            const base64 = await blobToBase64(blob);

            // Extract filename without extension to use as a key
            // e.g., "/assets/sword.png" becomes "sword"
            const filename = path.split('/').pop()?.split('.').shift();
            if (filename) {
                assetMap[filename] = base64;
            }
        } catch (error) {
            console.error(`Failed to load or convert image at ${path}:`, error);
            // We can decide to either throw, or let it fail gracefully.
            // For now, we'll just log the error and continue.
        }
    });

    await Promise.all(promises);

    return assetMap;
}
