import { createRouteHandler } from "uploadthing/server";

import { ourFileRouter } from "@/lib/uploadthing";

export const prerender = false;

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: import.meta.env.UPLOADTHING_TOKEN,
  },
});
export { handlers as GET, handlers as POST };
