import { resolve } from 'path'

import { generateApi } from 'swagger-typescript-api'

const swaggerPath = process.argv[2]

await generateApi({
  fileName: 'Api.ts',
  output: resolve(process.cwd(), './src/api'),
  ...(swaggerPath ? { input: resolve(swaggerPath) } : { url: 'http://localhost:8080/swagger/doc.json' }),
  httpClientType: 'axios',
})
