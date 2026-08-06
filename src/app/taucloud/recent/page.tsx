import TauCloudFilesPage from '@/components/taucloud/files/TauCloudFilesPage';

export const metadata = {
  title: 'Recent | Tau Cloud',
};

export default function Page() {
  return <TauCloudFilesPage mode="recent" />;
}
