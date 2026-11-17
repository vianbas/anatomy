import type { NextConfig } from "next";
import { defaultLocale } from "./app/i18n/config";

const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  ...(githubPages ? { output: "export", trailingSlash: true } : {}),
  // Every route lives under /[locale], so `app/[locale]/layout.tsx` is the root
  // layout and there is no page at `/`. Send bare visits to the default
  // language. (Accept-Language negotiation would need middleware, which the
  // Cloudflare/vinext target does not run — the in-app switcher covers it.)
  ...(!githubPages && {
    async redirects() {
      return [{ source: "/", destination: `/${defaultLocale}`, permanent: false }];
    },
  }),
};

export default nextConfig;
