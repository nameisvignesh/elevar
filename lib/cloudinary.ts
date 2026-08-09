const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();

export function getCloudinaryVideoUrl(publicId: string, fallback: string): string {
    if (!cloudName || !publicId) {
        return fallback;
    }

    return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`;
}

export function getCloudinaryImageUrl(publicId: string, fallback: string): string {
    if (!cloudName || !publicId) {
        return fallback;
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export function getYouTubeEmbedUrl(value?: string): string | null {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/);
    if (embedMatch) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
    }

    const watchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (watchMatch) {
        return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
    }

    const directIdMatch = trimmed.match(/^([A-Za-z0-9_-]{11})$/);
    if (directIdMatch) {
        return `https://www.youtube-nocookie.com/embed/${directIdMatch[1]}`;
    }

    return null;
}

const blobStoreId = process.env.NEXT_PUBLIC_BLOB_STORE_ID?.trim();
const blobPublicUrl = process.env.NEXT_PUBLIC_BLOB_PUBLIC_URL?.trim();

export function getVercelBlobVideoUrl(pathname: string, fallback: string): string {
    if (!pathname) {
        return fallback;
    }

    const normalizedPath = pathname.replace(/^\/+/u, '');
    if (blobPublicUrl) {
        return `${blobPublicUrl.replace(/\/+$|\/$/u, '')}/${normalizedPath}`;
    }

    if (blobStoreId) {
        return `https://${blobStoreId}.public.blob.vercel-storage.com/${normalizedPath}`;
    }

    return fallback;
}

export function isYouTubeVideoUrl(value?: string): boolean {
    return Boolean(getYouTubeEmbedUrl(value));
}
