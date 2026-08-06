import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Download Center | Tau Experience Platform',
  description: 'Download Tau Core, TauTalk, and developer previews for every platform.',
};

/** Legacy TXP route — canonical download center is /download */
export default function DownloadsPage() {
  redirect('/download');
}
