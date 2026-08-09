'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
            <h1>Upload Your Avatar</h1>

            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    setError(null);
                    setIsUploading(true);

                    if (!inputFileRef.current?.files?.length) {
                        setError('Please select a file to upload.');
                        setIsUploading(false);
                        return;
                    }

                    const file = inputFileRef.current.files[0];

                    try {
                        const response = await fetch(`/api/avatar/upload?filename=${encodeURIComponent(file.name)}`, {
                            method: 'POST',
                            body: file,
                        });

                        if (!response.ok) {
                            const errorPayload = await response.json().catch(() => null);
                            throw new Error(errorPayload?.error || 'Upload failed');
                        }

                        const newBlob = (await response.json()) as PutBlobResult;
                        setBlob(newBlob);
                    } catch (uploadError: any) {
                        setError(uploadError?.message || 'Unable to upload file.');
                        setBlob(null);
                    } finally {
                        setIsUploading(false);
                    }
                }}
            >
                <label style={{ display: 'block', marginBottom: 14, fontWeight: 600 }}>
                    Select an avatar image
                </label>
                <input
                    name="file"
                    ref={inputFileRef}
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    required
                    style={{ display: 'block', marginBottom: 16 }}
                />
                <button type="submit" disabled={isUploading} style={{ padding: '12px 18px', borderRadius: 8, border: 'none', background: '#0077b6', color: '#fff', cursor: 'pointer' }}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {error && (
                <p style={{ marginTop: 16, color: '#f87171' }}>{error}</p>
            )}

            {blob && (
                <div style={{ marginTop: 24, padding: 18, borderRadius: 16, background: '#0f172a', color: '#e2e8f0' }}>
                    <p><strong>Upload complete!</strong></p>
                    <p>Pathname: <code>{blob.pathname}</code></p>
                    <p>URL: <a href={blob.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{blob.url}</a></p>
                    <div style={{ marginTop: 12 }}>
                        <a href={`/api/avatar/view?pathname=${encodeURIComponent(blob.pathname)}`} style={{ color: '#7dd3fc', textDecoration: 'underline' }}>View file</a>
                    </div>
                </div>
            )}
        </div>
    );
}
