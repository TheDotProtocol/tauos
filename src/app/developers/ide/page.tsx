import { redirect } from 'next/navigation';

export default function LegacyIdeRedirect() {
  redirect('/developers/workspace');
}
