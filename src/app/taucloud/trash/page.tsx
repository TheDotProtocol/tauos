import TauCloudFilesPage from '@/components/taucloud/files/TauCloudFilesPage';

export const metadata = {
  title: 'Trash | Tau Cloud',
};

export default function Page() {
  return <TauCloudFilesPage mode="trash" />;
}
