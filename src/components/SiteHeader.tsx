import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">MarketVector</Link>
            <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Indexes</a>
              <a href="#" className="hover:text-gray-900">Insights</a>
              <a href="#" className="hover:text-gray-900">About</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Login</a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex h-12 items-center gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900">Featured</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Commentary</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Research</a>
            <Link href="/insights/news" className="font-medium text-gray-900">News</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}


