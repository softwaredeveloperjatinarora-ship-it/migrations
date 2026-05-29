'use server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import https from 'https';
import urls from '@/app/url';

async function resolveToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  const sessionToken = (session?.user as { token?: string })?.token;
  if (sessionToken) {
    return sessionToken.includes('NEXT2121ANG') ? sessionToken.split('NEXT2121ANG')[0] : sessionToken;
  }
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('next-auth.session-token')?.value;
  if (sessionCookie) {
    const decoded = await decode({ token: sessionCookie, secret: process.env.NEXTAUTH_SECRET ?? '' });
    const rawToken = (decoded as { token?: string })?.token ?? '';
    if (rawToken) return rawToken.includes('NEXT2121ANG') ? rawToken.split('NEXT2121ANG')[0] : rawToken;
  }
  return '';
}

export interface HeadAuthorityParams {
  Id: number;
  type: string;
  RoleType: string;
}

export async function getHeadAuthorityList(params: HeadAuthorityParams) {
  const token = await resolveToken();
  if (!token) return { status: 'error', message: 'Not authenticated', ApiData: null };

  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/Planning/GetHeadAuthorityList`,
      params,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, httpsAgent: agent }
    );
    return { status: 'success', ApiData: response.data };
  } catch (error: unknown) {
    const msg = axios.isAxiosError(error) ? `${error.response?.status} — ${error.message}` : String(error);
    return { status: 'error', message: msg, ApiData: null };
  }
}
