import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

interface InsightDetail {
  id: string;
  title: string;
  topic: string | null;
  insights_type: string;
  category: string;
  slug: string;
  publishDateTime: string;
  type: string;
  content: string | null;
  content_html: unknown;
  content_legacy: unknown;
  embedCode: unknown;
  content_link: string;
  speaker: string | null;
  index_type: string[];
  relatedIndex: {
    id: string;
    symbol: string;
    name: string;
    description: string | null;
    updatedAt: string;
    createdAt: string;
  } | null;
  relatedIndexes: Array<{
    id: string;
    symbol: string;
    name: string;
    description: string | null;
    updatedAt: string;
    createdAt: string;
  }>;
  authors: Array<{
    id: string;
    name: string;
    position: string;
    email: string;
    about: unknown;
    content_html: unknown;
    updatedAt: string;
    createdAt: string;
  }>;
  featured: boolean;
  access_counter: number | null;
  thumbnail_legacy: string | null;
  authorUserdefined: string | null;
  tagIndexes: string[] | null;
  status: string;
  updatedAt: string;
  createdAt: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function fetchInsight(id: string): Promise<InsightDetail> {
  // Get the host from headers for server-side fetching
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3001';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  const res = await fetch(`${protocol}://${host}/api/insights/${id}`, { next: { revalidate: 300 } });
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to load insight: ${res.status}`);
  }
  
  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InsightDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const insight = await fetchInsight(resolvedParams.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasHtml = isNonEmptyString(insight.content_html);
  const hasLegacyHtml = isNonEmptyString(insight.content_legacy);
  const hasPlainContent = isNonEmptyString(insight.content);
  const hasEmbed = isNonEmptyString(insight.embedCode);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <a href="/insights/news" className="hover:text-blue-600">← Back to Insights</a>
            <span>•</span>
            <span className="capitalize">{insight.category}</span>
            <span>•</span>
            <span>{insight.type}</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {insight.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {isNonEmptyString(insight.publishDateTime) && (
              <div>
                <span className="font-medium">Published:</span> {formatDate(insight.publishDateTime)}
              </div>
            )}
            
            {insight.authors && insight.authors.length > 0 && (
              <div>
                <span className="font-medium">Authors:</span> {insight.authors.map(a => a.name).join(', ')}
              </div>
            )}
            
            {isNonEmptyString(insight.insights_type) && (
              <div>
                <span className="font-medium">Type:</span> {insight.insights_type}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Thumbnail */}
            {isNonEmptyString(insight.thumbnail_legacy) ? (
              <figure className="mb-8">
                <img
                  src={insight.thumbnail_legacy}
                  alt={insight.title}
                  className="w-full rounded-lg border"
                />
              </figure>
            ) : null}

            {/* Embed code */}
            {hasEmbed ? (
              <div className="mb-8" dangerouslySetInnerHTML={{ __html: insight.embedCode as string }} />
            ) : null}

            {/* Content HTML */}
            {hasHtml ? (
              <div className="prose prose-lg max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: insight.content_html as string }} />
              </div>
            ) : null}
            
            {/* Legacy HTML fallback */}
            {!hasHtml && hasLegacyHtml ? (
              <div className="prose prose-lg max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: insight.content_legacy as string }} />
              </div>
            ) : null}
            
            {/* Plain text content fallback */}
            {!hasHtml && !hasLegacyHtml && hasPlainContent ? (
              <div className="prose prose-lg max-w-none mb-8">
                <p>{insight.content as string}</p>
              </div>
            ) : null}
            
            {/* Legacy Content Link */}
            {isNonEmptyString(insight.content_link) && (
              <div className="mb-8">
                <a
                  href={insight.content_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Report →
                </a>
              </div>
            )}
            
            {/* Related Indexes */}
            {insight.relatedIndex && (
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Related Index</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900">{insight.relatedIndex.name}</div>
                  <div className="text-sm text-gray-600">Symbol: {insight.relatedIndex.symbol}</div>
                  {isNonEmptyString(insight.relatedIndex.description) && (
                    <div className="text-sm text-gray-600 mt-2">{insight.relatedIndex.description}</div>
                  )}
                </div>
              </div>
            )}
            
            {insight.relatedIndexes && insight.relatedIndexes.length > 0 && (
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Related Indexes</h3>
                <div className="space-y-3">
                  {insight.relatedIndexes.map((index) => (
                    <div key={index.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-medium text-gray-900">{index.name}</div>
                      <div className="text-sm text-gray-600">Symbol: {index.symbol}</div>
                      {isNonEmptyString(index.description) && (
                        <div className="text-sm text-gray-600 mt-2">{index.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Authors */}
            {insight.authors && insight.authors.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Authors</h3>
                <div className="space-y-4">
                  {insight.authors.map((author) => (
                    <div key={author.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="font-medium text-gray-900">{author.name}</div>
                      {isNonEmptyString(author.position) && (
                        <div className="text-sm text-gray-600">{author.position}</div>
                      )}
                      {isNonEmptyString(author.about) && (
                        <div className="text-sm text-gray-600 mt-2">{author.about}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    insight.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {insight.status}
                  </span>
                </div>
                
                {insight.featured && (
                  <div className="text-blue-600 font-medium">⭐ Featured</div>
                )}
                
                {isNonEmptyString(insight.topic) && (
                  <div>
                    <span className="font-medium text-gray-700">Topic:</span> {insight.topic}
                  </div>
                )}
                
                {insight.index_type && insight.index_type.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Index Types:</span>
                    <div className="mt-1 space-y-1">
                      {insight.index_type.map((type, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700">Created:</span> {formatDate(insight.createdAt)}
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Updated:</span> {formatDate(insight.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
