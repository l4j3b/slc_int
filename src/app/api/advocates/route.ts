import db from "@/db";
import { advocates } from "@/db/schema";
import { ilike, or, count, sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const searchTerm = searchParams.get("searchTerm") || "";

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Build search conditions
    const searchConditions = searchTerm
      ? or(
          ilike(advocates.firstName, `%${searchTerm}%`),
          ilike(advocates.lastName, `%${searchTerm}%`),
          ilike(advocates.city, `%${searchTerm}%`),
          ilike(advocates.degree, `%${searchTerm}%`),
          sql`${advocates.specialties}::text ILIKE ${`%${searchTerm}%`}`,
          sql`${advocates.yearsOfExperience}::text ILIKE ${`%${searchTerm}%`}`,
        )
      : undefined;

    // Run both queries in parallel
    const [totalCountResult, data] = await Promise.all([
      // Get total count for pagination
      db.select({ count: count() }).from(advocates).where(searchConditions),

      // Get paginated data
      db
        .select()
        .from(advocates)
        .where(searchConditions)
        .limit(pageSize)
        .offset(offset),
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

    return Response.json({
      data,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    // TODO: Log the error to Sentry etc.
    console.error("Error fetching advocates:", error);

    return Response.json(
      { error: "Failed to fetch advocates." },
      { status: 500 },
    );
  }
}
