import app from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./db/mongo.js";
import "./models/index.js";

async function bootstrap() {
  await connectMongo(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`[api] listening on :${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((error) => {
  console.error("[api] bootstrap failed", error);
  process.exit(1);
});
