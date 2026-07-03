import { redirect } from 'next/navigation';

/** Legacy route — mail dashboard lives at /taumail/dashboard */
export default function DashboardPage() {
  redirect('/taumail/dashboard');
}
