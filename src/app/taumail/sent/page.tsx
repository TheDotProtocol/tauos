import MailFolderView from '@/components/taumail/shared/MailFolderView';

export const metadata = { title: 'Sent | Tau Mail' };

export default function SentPage() {
  return <MailFolderView folder="sent" title="Sent" activeNav="sent" />;
}
