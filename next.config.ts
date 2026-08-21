import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * GitHub Pages serves static files only — no Node server.
   * `export` writes a fully static site to ./out, which the Pages workflow uploads.
   */
  output: 'export',

  /** `/work/habitat/index.html` instead of `/work/habitat.html`, so Pages resolves clean URLs. */
  trailingSlash: true,

  /** next/image's optimizer needs a server; Pages has none. */
  images: { unoptimized: true },

  /** Pin the workspace root: without it Turbopack walks up to the home
   *  directory looking for a lockfile and warns about the whole Desktop. */
  turbopack: { root: path.resolve('.') },
};

export default nextConfig;
