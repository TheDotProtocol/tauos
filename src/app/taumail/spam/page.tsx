import MailFolderView from '@/components/taumail/shared/MailFolderView';

export const metadata = { title: 'Spam | Tau Mail' };

export default function SpamPage() {
  return <MailFolderView folder="spam" title="Spam" activeNav="spam" />;
}
