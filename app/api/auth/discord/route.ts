import { redirect } from 'next/navigation';
import { getDiscordAuthUrl } from '@/lib/auth';

export async function GET() {
  const authUrl = getDiscordAuthUrl();
  redirect(authUrl);
}
