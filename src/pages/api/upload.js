import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
    try {
        const jsonResponse = await handleUpload({
            request,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return Response.json(jsonResponse);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}
