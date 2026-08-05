import MailFolderView from '@/components/taumail/shared/MailFolderView';

export const metadata = { title: 'Inbox | Tau Mail' };

export default function InboxPage() {
  return <MailFolderView folder="inbox" title="Inbox" activeNav="inbox" showTabs />;
}
