import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const beatId = searchParams.get('beatId'); // Optional filter by beat

    const prefix = beatId ? `beats/${beatId}/` : 'beats/';

    const { blobs } = await list({
      prefix,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Group blobs by beatId
    const grouped: Record<string, { url: string; pathname: string; size: number; fileType: string }[]> = {};

    for (const blob of blobs) {
      // pathname format: beats/{beatId}/{fileType}.{ext}
      const parts = blob.pathname.replace('beats/', '').split('/');
      const id = parts[0];
      const fileName = parts[1] || '';
      const fileType = fileName.split('.')[0]; // preview, wav, mp3, stems

      if (!grouped[id]) grouped[id] = [];
      grouped[id].push({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        fileType,
      });
    }

    return NextResponse.json({
      success: true,
      grouped,
      total: blobs.length,
    });
  } catch (err: any) {
    console.error('Blob list error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
