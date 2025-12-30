import 'dotenv/config'
import type { PrismaConfig } from 'prisma'

const config: PrismaConfig = {
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
}

export default config