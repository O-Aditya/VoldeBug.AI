import { NextRequest, NextResponse } from "next/server";
import { auth } from "@web/lib/auth";
import { env } from "@web/lib/env";

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}
export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}
export async function PATCH(request: NextRequest) {
  return handleRequest(request, "PATCH");
}
export async function PUT(request: NextRequest) {
  return handleRequest(request, "PUT");
}
export async function DELETE(request: NextRequest) {
  return handleRequest(request, "DELETE");
}

async function handleRequest(request: NextRequest, method: string) {
  const session = await auth();
  const user = session?.user as any;
  if (!user?.id) {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Not authenticated" }, meta: { timestamp: new Date().toISOString() } },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const proxyPath = url.pathname.replace(/^\/api\/proxy/, "/v1");
  const backendUrl = `${env.NEXT_PUBLIC_API_URL}${proxyPath}${url.search}`;
  const body = method !== "GET" ? await request.text() : undefined;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": user.id || "",
    "X-User-Role": user.role || "",
    "X-User-Email": user.email || "",
  };
  if (user.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }

  const res = await fetch(backendUrl, {
    method,
    headers,
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
