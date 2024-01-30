import { buildConfig } from "payload/config";
import dotenv from "dotenv";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import path from "path";
import { users } from "../collections/users";
import { products } from "../collections/product";
import { media } from "../collections/media";
import { productFiles } from "../collections/productFile";
import { orders } from "../collections/orders";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  collections: [users, products, media, productFiles, orders],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- Marketplace",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url:
      process.env.MONGODB_URL ||
      "mongodb+srv://asd:asd@cluster.ic3wusp.mongodb.net/?retryWrites=true&w=majority",
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
});
