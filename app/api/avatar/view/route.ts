import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const pathname = req.nextUrl.searchParams.get('pathname');

    if (!pathname) {
        return NextResponse.json({ error: 'pathname is required' }, { status: 400 });
    }

    const normalizedPath = pathname.replace(/^\/+/, '');
    const blobPublicUrl = process.env.NEXT_PUBLIC_BLOB_PUBLIC_URL?.trim();
    const blobStoreId = (process.env.BLOB_STORE_ID || process.env.NEXT_PUBLIC_BLOB_STORE_ID || '').trim();

    if (!blobPublicUrl && !blobStoreId) {
        return NextResponse.json({ error: 'Blob store configuration is missing' }, { status: 500 });
    }

    const url = blobPublicUrl
        ? `${blobPublicUrl.replace(/\/+$/, '')}/${normalizedPath}`
        : `https://${blobStoreId}.public.blob.vercel-storage.com/${normalizedPath}`;

    return NextResponse.redirect(url);
}
