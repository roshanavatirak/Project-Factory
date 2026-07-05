import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Verification failed: Missing inquiry ID parameters.", { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    let token = "";
    if (sessionCookie && sessionCookie.value) {
      token = JSON.parse(sessionCookie.value).token || "";
    }

    const res = await fetch(`${BACKEND_URL}/api/invoice?id=${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errMsg = await res.text();
      return new Response(errMsg || "Failed to download invoice.", { status: res.status });
    }

    const pdfBuffer = await res.arrayBuffer();

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${id.slice(0, 8)}.pdf`,
      },
    });

  } catch (error) {
    console.error("PDF Invoice API Proxy Route Error Log:", error);
    return new Response("Internal Server Error: Failed to retrieve PDF Invoice document.", { status: 500 });
  }
}
