export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // GraphQL query for individual insight
  const query = `
    query GetInsight($id: Int!) {
      Insight(id: $id) {
        id
        title
        topic
        insights_type
        category
        slug
        publishDateTime
        type
        content
        content_html
        content_legacy
        embedCode
        content_link
        speaker
        index_type
        relatedIndex {
          id
          symbol
          name
          description
          updatedAt
          createdAt
        }
        relatedIndexes {
          id
          symbol
          name
          description
          updatedAt
          createdAt
        }
        authors {
          id
          name
          position
          email
          about
          content_html
          updatedAt
          createdAt
        }
        featured
        access_counter
        thumbnail_legacy
        authorUserdefined
        tagIndexes
        status
        updatedAt
        createdAt
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
          id: parseInt(id),
        },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`GraphQL API error for insight ${id}:`, res.status, text);
      return new Response(
        JSON.stringify({ 
          error: "GraphQL error", 
          status: res.status, 
          body: text,
          insightId: id,
          graphqlUrl 
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    
    if (data.errors) {
      console.error(`GraphQL errors for insight ${id}:`, data.errors);
      return new Response(
        JSON.stringify({ 
          error: "GraphQL errors", 
          errors: data.errors,
          insightId: id,
          query,
          variables: { id: parseInt(id) }
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const insight = data.data?.Insight;
    
    if (!insight) {
      console.error(`Insight not found: ${id}`, data);
      return new Response(
        JSON.stringify({ 
          error: "Insight not found",
          insightId: id,
          responseData: data
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return Response.json(insight, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error(`Failed to fetch insight ${id}:`, error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch insight", 
        details: String(error),
        insightId: id
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
