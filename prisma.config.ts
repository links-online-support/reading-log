import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // マイグレーション実行時はプーラーを経由しない直接接続を使う
    // (参照: https://neon.com/docs/connect/connection-pooling.md)
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
