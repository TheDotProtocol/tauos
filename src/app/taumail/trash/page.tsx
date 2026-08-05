import MailFolderView from '@/components/taumail/shared/MailFolderView';

export const metadata = { title: 'Trash | Tau Mail' };

export default function TrashPage() {
  return <MailFolderView folder="trash" title="Trash" activeNav="trash" />;
}
