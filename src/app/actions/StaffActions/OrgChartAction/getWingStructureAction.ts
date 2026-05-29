'use server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import https from 'https';
import urls from '@/app/url';

async function resolveToken(): Promise<string> {
  // 1. Try getServerSession first
  const session = await getServerSession(authOptions);
  const sessionToken = (session?.user as { token?: string })?.token;
  if (sessionToken) {
    console.log('[OrgChart] token via getServerSession');
    return sessionToken.includes('NEXT2121ANG') ? sessionToken.split('NEXT2121ANG')[0] : sessionToken;
  }

  // 2. Fallback: read next-auth.session-token cookie directly and decode it
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log('[OrgChart] cookies present:', allCookies.map((c: { name: string }) => c.name));

  const sessionCookie = cookieStore.get('next-auth.session-token')?.value;
  console.log('[OrgChart] next-auth.session-token cookie:', sessionCookie ? 'PRESENT' : 'MISSING');

  if (sessionCookie) {
    const secret = process.env.NEXTAUTH_SECRET ?? '';
    const decoded = await decode({ token: sessionCookie, secret });
    console.log('[OrgChart] decoded JWT keys:', decoded ? Object.keys(decoded) : 'null');
    const rawToken = (decoded as { token?: string })?.token ?? '';
    if (rawToken) {
      return rawToken.includes('NEXT2121ANG') ? rawToken.split('NEXT2121ANG')[0] : rawToken;
    }
  }

  return '';
}

export async function getWingStructure() {
  const token = await resolveToken();
  console.log('[Wings] resolved token (first 40):', token ? token.substring(0, 40) + '…' : 'EMPTY');
  console.log('[Wings] basewebapiurl:', urls.basewebapiurl);

  if (!token) return { status: 'error', message: 'Not authenticated', ApiData: null };

  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/OBPStructureBridge/GetWingStructure`,
      {},
      { headers: { Authorization: `Bearer ${token}` }, httpsAgent: agent }
    );
    console.log('[Wings] success, items:', response.data?.item1?.length ?? 0);
    return { status: 'success', ApiData: response.data };
  } catch (error: unknown) {
    const msg = axios.isAxiosError(error)
      ? `${error.response?.status} — ${error.message}`
      : String(error);
    console.error('[Wings] error:', msg);
    return { status: 'error', message: msg, ApiData: null };
  }
}
