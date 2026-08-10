import { startServerAndCreateNextHandler } from "@as-integrations/next";
import type { NextRequest } from "next/server";

import { apolloServer } from "./server";

const handler = startServerAndCreateNextHandler(apolloServer);

export function GET(request: NextRequest) {
  return handler(request);
}

export function POST(request: NextRequest) {
  return handler(request);
}
