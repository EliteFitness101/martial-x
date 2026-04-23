export async function POST(req) {
  const data = await req.json();

  if (data.event === "charge.success") {
    console.log("Upgrade user subscription");
  }

  return Response.json({ ok: true });
}
