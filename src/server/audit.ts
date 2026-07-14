import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export async function logAudit(params: {
  staffUserId: string | null;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
}) {
  await db.insert(auditLogs).values({
    staffUserId: params.staffUserId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    details: params.details,
  });
}
