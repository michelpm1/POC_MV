export async function GET() {
  const data = {
    message: "ok",
    items: [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Beta" },
      { id: 3, name: "Gamma" },
    ],
  };

  return Response.json(data);
}


