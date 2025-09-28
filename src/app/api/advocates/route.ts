import db from "@/db";
import { advocates } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(advocates);

    return Response.json({ data });
  } catch (error) {
    // TODO:Log the error to Sentry etc.
    console.error("Error fetching advocates:", error);

    return Response.json({}, { status: 500 });
  }
}
