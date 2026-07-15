import { NextRequest, NextResponse } from 'next/server';
import { list, del, put } from '@vercel/blob';

export async function DELETE(req: NextRequest) {
  try {
    const { beatId } = await req.json();
    if (!beatId) return NextResponse.json({ error: 'beatId required' }, { status: 400 });

    // Remove all files for this beat from Vercel Blob
    const { blobs } = await list({ prefix: `beats/${beatId}/`, token: process.env.BLOB_READ_WRITE_TOKEN });
    if (blobs.length > 0) {
      await del(blobs.map((b) => b.url), { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    // Remove from catalog JSON
    const catalogBlobs = await list({ prefix: 'catalog/beats.json', token: process.env.BLOB_READ_WRITE_TOKEN });
    if (catalogBlobs.blobs.length > 0) {
      const res = await fetch(catalogBlobs.blobs[0].url);
      const catalog = await res.json();
      const updated = catalog.filter((b: { id: string }) => b.id !== beatId);
      await put('catalog/beats.json', JSON.stringify(updated, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    }

    return NextResponse.json({ success: true, deleted: beatId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
