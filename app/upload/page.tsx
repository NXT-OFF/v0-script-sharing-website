import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { UploadForm } from '@/components/upload/upload-form';
import { getCurrentUser } from '@/lib/auth';

export default async function UploadPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/discord');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Uploader une ressource
            </h1>
            <p className="mt-2 text-muted-foreground">
              Partagez votre creation avec la communaute FiveM
            </p>
          </div>
          <UploadForm user={user} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
