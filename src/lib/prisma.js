// import 'dotenv/config'

//  import { PrismaClient } from '@prisma/client'
//  import { Pool } from 'pg'
//  import { PrismaPg } from '@prisma/adapter-pg'

//  const pool = new Pool({
//    connectionString: process.env.DATABASE_URL,
//  })

//  const adapter = new PrismaPg(pool)

//  const prisma = new PrismaClient({
//    adapter,
//  })

//  export default prisma

import 'dotenv/config'

import prismaPkg from '@prisma/client'
import pgPkg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const { PrismaClient } = prismaPkg
const { Pool } = pgPkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

export default prisma
