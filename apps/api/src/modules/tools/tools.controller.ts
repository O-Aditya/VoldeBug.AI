import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleListTools(req: Request, res: Response) {
  try {
    const { category, search } = req.query;

    const where: { category?: string; search?: { mode: "insensitive"; contains: string } } = {};
    if (category) where.category = category as string;
    if (search && typeof search === "string") {
      where.search = { mode: "insensitive", contains: search };
    }

    const tools = await prisma.tool.findMany({
      orderBy: { usageCount: "desc" },
    });

    const filtered = tools.filter((t) => {
      if (!where.category && !where.search) return true;
      if (where.category && t.category !== where.category) return false;
      if (where.search && !t.name.toLowerCase().includes((where.search as any).contains.toLowerCase()) &&
          !t.description.toLowerCase().includes((where.search as any).contains.toLowerCase())) return false;
      return true;
    });

    return apiSuccess(res, filtered);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch tools", status: 500 });
  }
}

export async function handleGetTool(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tool = await prisma.tool.findUnique({
      where: { id },
    });
    if (!tool) {
      return apiError(res, { code: "NOT_FOUND", message: "Tool not found", status: 404 });
    }
    return apiSuccess(res, tool);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch tool", status: 500 });
  }
}
