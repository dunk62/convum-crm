import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy API to fetch Google Drive files and bypass CORS
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileId, filename } = req.query;

        if (!fileId || typeof fileId !== 'string') {
            return res.status(400).json({ error: 'Missing fileId parameter' });
        }

        // Get Google API Key from environment
        const apiKey = process.env.VITE_GOOGLE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Google API Key not configured' });
        }

        // Fetch file metadata first to get the file name
        const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType&key=${apiKey}`;
        const metadataResponse = await fetch(metadataUrl);

        if (!metadataResponse.ok) {
            const errorText = await metadataResponse.text();
            console.error('Metadata fetch error:', errorText);
            return res.status(metadataResponse.status).json({
                error: 'Failed to fetch file metadata',
                details: errorText
            });
        }

        const metadata = await metadataResponse.json();
        const fileName = metadata.name || 'model.stp';

        // Fetch the actual file content
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
        const fileResponse = await fetch(downloadUrl);

        if (!fileResponse.ok) {
            const errorText = await fileResponse.text();
            console.error('File download error:', errorText);
            return res.status(fileResponse.status).json({
                error: 'Failed to download file',
                details: errorText
            });
        }

        // Get the file as ArrayBuffer
        const fileBuffer = await fileResponse.arrayBuffer();

        // Determine content type based on file extension
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        let contentType = 'application/octet-stream';

        if (ext === 'stp' || ext === 'step') {
            contentType = 'application/step';
        } else if (ext === 'igs' || ext === 'iges') {
            contentType = 'application/iges';
        } else if (ext === 'stl') {
            contentType = 'model/stl';
        }

        // Set response headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Content-Length', fileBuffer.byteLength.toString());

        // Send the binary data
        return res.status(200).send(Buffer.from(fileBuffer));

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
