import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

function sanitizeFileName(value: string) {
    const decoded = decodeURIComponent(value || 'upload');
    const name = decoded.trim().replace(/\s+/g, '-');
    return name.replace(/[^a-zA-Z0-9._-]/g, '') || 'upload-file';
}

export async function POST(req: NextRequest) {
    const fileName = req.nextUrl.searchParams.get('filename');

    if (!fileName) {
        return NextResponse.json({ error: 'filename is required' }, { status: 400 });
    }

    const fileBlob = await req.blob();
    if (!fileBlob || fileBlob.size === 0) {
        return NextResponse.json({ error: 'No file data supplied' }, { status: 400 });
    }

    const safeFileName = sanitizeFileName(fileName);
    const pathname = `avatars/${Date.now()}-${safeFileName}`;
    const contentType = fileBlob.type || undefined;

    try {
        const blob = await put(pathname, fileBlob, {
            access: 'public',
            contentType,
            addRandomSuffix: false,
            token: process.env.BLOB_READ_WRITE_TOKEN,
            storeId: process.env.BLOB_STORE_ID || undefined,
        });

        return NextResponse.json(blob);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to upload avatar' }, { status: 500 });
    }
}
