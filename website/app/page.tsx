import { redirect } from 'next/navigation';

// Root page - redirect to default locale home page
export default function RootPage() {
  redirect('/en/home');
}
