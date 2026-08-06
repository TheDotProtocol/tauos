import TauCloudPreviewPage from '@/components/taucloud/preview/TauCloudPreviewPage';

export const metadata = {
  title: 'Preview | Tau Cloud',
};

export default function Page({ params }: { params: { id: string } }) {
  return <TauCloudPreviewPage fileId={params.id} />;
}
