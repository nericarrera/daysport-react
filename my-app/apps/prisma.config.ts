// prisma.config.ts
   import { defineConfig } from '@prisma/internals'

export default defineConfig({
  schema: 'apps/backend/src/prisma/schema.prisma',
  out: 'apps/backend/src/prisma/generated'
})