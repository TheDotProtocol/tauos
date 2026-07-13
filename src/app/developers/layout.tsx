import Link from 'next/link';

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/developers" className="font-bold text-yellow-400">
              Tau Developer
            </Link>
            <nav className="hidden sm:flex gap-4 text-sm text-gray-300">
              <Link href="/developers/ide" className="hover:text-yellow-400">
                IDE
              </Link>
              <Link href="/docs" className="hover:text-yellow-400">
                Docs
              </Link>
              <Link href="/tauid/login" className="hover:text-yellow-400">
                Tau ID
              </Link>
            </nav>
          </div>
          <Link href="https://www.tauos.org" className="text-xs text-gray-500 hover:text-gray-300">
            tauos.org
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
