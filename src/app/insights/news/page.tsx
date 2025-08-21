import Pagination from "@/components/Pagination";
import { headers } from "next/headers";

export const metadata = {
  title: "News | Insights",
};

export const dynamic = "force-dynamic";

interface InsightItem {
  id?: string;
  title?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  [key: string]: unknown;
}

interface PaginationInfo {
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

async function fetchInsights(limit = 10, sort = "-createdAt", page = 1): Promise<{ items: InsightItem[]; raw: unknown; pagination: PaginationInfo }> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");

  const baseUrl = `${proto}://${host}/api/insights`;
  const url = new URL(baseUrl);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", sort);
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to load insights: ${res.status} ${body}`);
  }
  const data = await res.json();
  
  // Handle the new GraphQL response format
  const items = data?.docs || [];
  const pagination = {
    totalDocs: data?.totalDocs || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || 1,
    hasNextPage: data?.hasNextPage || false,
    hasPrevPage: data?.hasPrevPage || false,
  };
  
  return { items, raw: data, pagination };
}

function getItemTitle(item: InsightItem): string {
  return (
    item?.title ||
    item?.headline ||
    item?.name ||
    item?.attributes?.title ||
    item?.attributes?.headline ||
    "Untitled"
  );
}

function getItemType(item: InsightItem): string {
  return item?.type || item?.attributes?.type || "Insight";
}

function getItemSummary(item: InsightItem): string | null {
  // Since summary, excerpt, and description fields don't exist in the GraphQL schema,
  // we'll provide a fallback or return null
  return (
    item?.summary ||
    item?.excerpt ||
    item?.description ||
    item?.attributes?.summary ||
    item?.attributes?.excerpt ||
    item?.attributes?.description ||
    // Fallback: show creation date if no summary available
    item?.createdAt ? `Published on ${new Date(item.createdAt as string).toLocaleDateString()}` : null
  );
}

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string; sort?: string }>;
}

export default async function InsightsNewsPage({ searchParams }: PageProps) {
  // Await searchParams to fix Next.js warning
  const params = await searchParams;
  
  const currentPage = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const sort = params.sort || "-createdAt";
  
  let items: InsightItem[] = [];
  let errorMessage: string | null = null;
  let pagination: PaginationInfo | null = null;
  
  try {
    const res = await fetchInsights(limit, sort, currentPage);
    items = res.items;
    pagination = res.pagination;
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e);
  }

  // Generate URLs for navigation
  const generateUrl = (newParams: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    
    // Safely add existing search params, filtering out Symbols and non-string values
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string' && value !== undefined) {
        urlParams.set(key, value);
      }
    });
    
    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
    
    return `?${urlParams.toString()}`;
  };

  const itemsPerPageOptions = [5, 10, 20, 50];

  return (
    <div className="bg-white">
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">News</h1>
          <p className="mt-2 text-sm text-gray-600">Check out the latest MarketVector news on our indexes and company.</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-10">
            <aside className="md:w-64 flex-shrink-0">
              <div className="space-y-4">
                <button className="w-full rounded border px-3 py-2 text-left text-sm">open filters</button>
                
                {/* Items per page selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Items per page</label>
                  <div className="flex flex-wrap gap-2">
                    {itemsPerPageOptions.map((option) => (
                      <a
                        key={option}
                        href={generateUrl({ limit: option.toString(), page: "1" })}
                        className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                          limit === option
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Sort options */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sort by</label>
                  <div className="space-y-1">
                    <a
                      href={generateUrl({ sort: "-createdAt", page: "1" })}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        sort === "-createdAt"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Newest first
                    </a>
                    <a
                      href={generateUrl({ sort: "createdAt", page: "1" })}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        sort === "createdAt"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Oldest first
                    </a>
                    <a
                      href={generateUrl({ sort: "-type", page: "1" })}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        sort === "-type"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Type (A-Z)
                    </a>
                  </div>
                </div>
              </div>
            </aside>
            
            <div className="flex-1">
              {errorMessage ? (
                <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
              ) : items.length === 0 ? (
                <div className="text-sm text-gray-600">No insights found.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                      <article key={item?.id ?? idx} className="rounded border p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs text-gray-500">{getItemType(item)}</div>
                        <h3 className="mt-2 text-base font-medium">{getItemTitle(item)}</h3>
                        {getItemSummary(item) ? (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{getItemSummary(item)}</p>
                        ) : null}
                        <a 
                          href={`/insights/${item?.id}`}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center group"
                        >
                          Read more 
                          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && (
                    <>
                      
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalDocs={pagination.totalDocs}
                        itemsPerPage={limit}
                        generatePageUrl={(page) => generateUrl({ page: page.toString() })}
                        className="mt-8"
                      />
                    </>
                  )}
                  
                  {/* Fallback pagination info if pagination data is missing */}
                  {!pagination && items.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-600">
                      Showing {items.length} insights
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


