import { NextResponse } from "next/server";
import { auth } from "@web/lib/auth";

export async function GET() {
  const session = await auth();
  const token = (session?.user as any)?.token;
  if (!token) {
    return NextResponse.json({ token: null }, { status: 401 });
  }
  return NextResponse.json({ token });
}
