import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';
const SESSION_VALUE = 'authenticated';
// Cookie lasts 8 hours
const MAX_AGE = 60 * 60 * 8;

// POST /api/admin/auth — log in
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct) {
    return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
  }

  if (password !== correct) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}

// DELETE /api/admin/auth — log out
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
