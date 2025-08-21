export async function GET() {
  try {
    const query = `
      query TestQuery {
        Insights(limit: 1) {
          docs {
            id
            title
            type
          }
          totalDocs
        }
      }
    `;

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
        variables: {},
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ 
        error: "GraphQL error", 
        status: res.status, 
        body: text,
        headers: Object.fromEntries(res.headers.entries())
      });
    }

    const data = await res.json();
    
    if (data.errors) {
      return Response.json({ 
        error: "GraphQL errors", 
        errors: data.errors,
        schema: "Available fields: id, title, type"
      });
    }

    return Response.json({ 
      success: true, 
      data: data.data,
      endpoint: graphqlUrl,
      hasToken: !!token
    });
  } catch (error) {
    return Response.json({ 
      error: "Failed to test GraphQL", 
      details: String(error) 
    });
  }
}
