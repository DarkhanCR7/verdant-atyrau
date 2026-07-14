import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/require-staff";
import { listAppointments } from "@/server/appointments";

export async function GET(req: Request) {
  const { response } = await requireStaff();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const result = await listAppointments({
    date: searchParams.get("date") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    doctorId: searchParams.get("doctorId") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 20,
  });

  return NextResponse.json(result);
}
