import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

// ── Upload audio file + save metadata in one step ──
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const previewFile = formData.get('previewFile') as File | null;
    const mp3File     = formData.get('mp3File')     as File | null;
    const wavFile     = formData.get('wavFile')      as File | null;

    const title    = (formData.get('title')    as string)?.trim();
    const bpm      = parseInt(formData.get('bpm') as string, 10);
    const key      = (formData.get('key')      as string)?.trim();
    const tags     = (formData.get('tags')     as string)?.split(',').map((t) => t.trim()).filter(Boolean);
    const genre    = (formData.get('genre')    as string)?.trim();
    const duration = (formData.get('duration') as string)?.trim() || '3:00';

    if (!title || !bpm || !key) {
      return NextResponse.json({ error: 'title, bpm, and key are required' }, { status: 400 });
    }

    if (!previewFile && !mp3File && !wavFile) {
      return NextResponse.json({ error: 'At least one audio file (preview, MP3, or WAV) is required' }, { status: 400 });
    }

    // Generate a slug-based ID from the title
    const id = 'beat-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    // Upload whichever files were provided
    const urls: Record<string, string> = {};

    const uploadFile = async (file: File, type: string) => {
      const ext = file.name.split('.').pop() || 'mp3';
      const blob = await put(`beats/${id}/${type}.${ext}`, file, {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      urls[type] = blob.url;
    };

    if (previewFile) await uploadFile(previewFile, 'preview');
    if (mp3File)     await uploadFile(mp3File,     'mp3');
    if (wavFile)     await uploadFile(wavFile,      'wav');

    // Build beat metadata object
    const beat = {
      id,
      title,
      bpm,
      key,
      tags: tags || [],
      genre: genre || tags?.[0] || 'Other',
      duration,
      previewUrl: urls.preview || urls.mp3 || null,
      mp3Url:     urls.mp3 || null,
      wavUrl:     urls.wav || null,
      badge: null,
      createdAt: new Date().toISOString(),
    };

    // Persist metadata as a JSON file in Vercel Blob (catalog store)
    // Load existing catalog first
    let catalog: typeof beat[] = [];
    try {
      const { blobs } = await list({ prefix: 'catalog/beats.json', token: process.env.BLOB_READ_WRITE_TOKEN });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        catalog = await res.json();
      }
    } catch {}

    catalog.push(beat);

    await put('catalog/beats.json', JSON.stringify(catalog, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ success: true, beat, urls });
  } catch (err: any) {
    console.error('Beat upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Fetch entire catalog ──
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'catalog/beats.json', token: process.env.BLOB_READ_WRITE_TOKEN });
    if (blobs.length === 0) return NextResponse.json({ beats: [] });

    // Always bust cache with timestamp
    const res = await fetch(blobs[0].url + '?t=' + Date.now());
    const beats = await res.json();
    return NextResponse.json({ beats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
