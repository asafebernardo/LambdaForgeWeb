import { startSchedulers } from "./schedulers/cron.js";
import { startWorkers } from "./queue/workers.js";

async function main() {
  console.log("[indexer] starting CapyMods indexer…");
  const stopWorkers = startWorkers();
  const stopSchedulers = await startSchedulers();

  const shutdown = async () => {
    console.log("[indexer] shutting down…");
    await stopSchedulers();
    await stopWorkers();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[indexer] fatal:", err);
  process.exit(1);
});
