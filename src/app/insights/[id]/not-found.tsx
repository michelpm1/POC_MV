import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Insight Not Found</h1>
        <p className="text-gray-600 mb-8">
          The insight you&rsquo;re looking for doesn&rsquo;t exist or may have been removed.
        </p>
        <Link
          href="/insights/news"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Insights
        </Link>
      </div>
    </div>
  );
}
