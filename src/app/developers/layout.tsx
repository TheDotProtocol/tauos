import '@/styles/tau-ide.css';

export const metadata = {
  title: 'Tau IDE — Developer Platform',
  description: 'Design, build, and deploy software with Tau IDE — TauScript, Tau Architect, Git, and deployment in one platform.',
};

export default function DevelopersRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="tau-ide">{children}</div>;
}
