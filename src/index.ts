import * as web3 from "@solana/web3.js";
import * as dotenv from "dotenv";

dotenv.config();

const SOLANA_RPC_ENDPOINT =
  process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";

// Tracked Wallets
const TRACKED_WALLETS = [
  "GY3AxLwJtXMKEcs6iRauT4C6oPtivjjhRQjtAxtWeNx9",
  "4zq1iLpmepj2Rj7W6A3XQMRQA1HyjYqVpZiBzM6aPyH7",
];

class WalletTracker {
  private connection: web3.Connection;

  constructor() {
    this.connection = new web3.Connection(SOLANA_RPC_ENDPOINT, "confirmed");
  }

  async startTracking() {
    console.log("Stalkr Initialized, scanning...");

    for (const wallet of TRACKED_WALLETS) {
      const pubkey = new web3.PublicKey(wallet);
      this.connection.onLogs(
        pubkey,
        (logs, context) => {
          this.handleTransaction(wallet, logs, context);
        },
        "confirmed"
      );
      console.log(`Targeting: ${wallet}`);
    }
  }

  private async handleTransaction(
    wallet: string,
    logs: web3.Logs,
    context: web3.Context
  ) {
    console.log(`\n New trasaction for wallet: ${wallet}`);
    // console.log(`Signature: ${context.signature}`);
    console.log(`Slot: ${context.slot}`);
    console.log("Logs: ", logs);
    logs.logs.forEach((log) => console.log(log));

    try {
      const transaction = await this.connection.getTransaction(logs.signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (transaction && transaction.meta) {
        const preBalance = transaction.meta.preBalances[0] || 0;
        const postBalance = transaction.meta.postBalances[0] || 0;

        console.log(
          `Amount: ${
            transaction.meta?.postBalances[0] - transaction.meta?.preBalances[0]
          } lamports`
        );
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }

    console.log("----------------------------------------");
  }
}

const tracker = new WalletTracker();
tracker.startTracking();
