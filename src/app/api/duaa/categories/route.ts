import { NextResponse } from "next/server";
import categories from "@/data/seed_categories.json";

export async function GET() {
  return NextResponse.json(categories);
}

