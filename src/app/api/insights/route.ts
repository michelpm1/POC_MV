export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Defaults
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const sort = searchParams.get("sort") ?? "-createdAt";
  const page = parseInt(searchParams.get("page") ?? "1");

  // GraphQL query for insights
  const query = `
    query GetInsights($limit: Int!, $page: Int!, $sort: String) {
      Insights(limit: $limit, page: $page, sort: $sort) {
        docs {
          id
          title
          type
          createdAt
          updatedAt
          slug
        }
        totalDocs
        totalPages
        page
        hasNextPage
        hasPrevPage
      }
    }
  `;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    const token = process.env.MV_CMS_TOKEN;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const graphqlUrl = "https://dev-cms.marketvector.com/api/graphql";
    
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: {
          limit,
          page,
          sort,
        },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: "GraphQL error", status: res.status, body: text }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    
    if (data.errors) {
      return new Response(
        JSON.stringify({ error: "GraphQL errors", errors: data.errors }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Transform GraphQL response to match expected format
    const insights = data.data?.Insights || { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasNextPage: false, hasPrevPage: false };
    
    return Response.json(insights, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
          return new Response(
        JSON.stringify({ error: "Failed to fetch insights", details: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
  }
}


