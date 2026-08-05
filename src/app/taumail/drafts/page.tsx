import MailFolderView from '@/components/taumail/shared/MailFolderView';

export const metadata = { title: 'Drafts | Tau Mail' };

export default function DraftsPage() {
  return <MailFolderView folder="drafts" title="Drafts" activeNav="drafts" />;
}
