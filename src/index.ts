import * as web3 from "@solana/web3.js";
import { ParsedInstruction } from "@solana/web3.js";
import * as dotenv from "dotenv";

dotenv.config();

// const SOLANA_RPC_ENDPOINT =
//   process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";

const HELIUS_API_KEY = process.env.HELIUS_RPC_KEY || "";
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

const TRACKED_WALLETS = [
  //   "GY3AxLwJtXMKEcs6iRauT4C6oPtivjjhRQjtAxtWeNx9",
  //   "4zq1iLpmepj2Rj7W6A3XQMRQA1HyjYqVpZiBzM6aPyH7",
  "DJm944mMLK17hjrDQ9tHiCdxZjAiXUyqC43Vsh1UirAE",
];

class WalletTracker {
  constructor() {
    if (!HELIUS_API_KEY) {
      throw new Error("HELIUS_API_KEY is required");
    }
  }

  async getWalletAssets(walletAddress: string) {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: walletAddress,
            page: 1,
            limit: 1000,
            displayOptions: {
              showFungible: true,
            },
          },
        }),
      });

      const { result } = await response.json();
      console.log(`\nAssets for wallet ${walletAddress}:`);
      console.log(JSON.stringify(result.items, null, 2));
      return result.items;
    } catch (error) {
      console.error(`Error fetching assets for walelt ${walletAddress}`);
      return [];
    }
  }

  async startTracking() {
    console.log("Stalkr Ready, scanning...");

    for (const wallet of TRACKED_WALLETS) {
      console.log(`Tracking: ${wallet}`);
      await this.getWalletAssets(wallet);
    }
  }
}

const tracker = new WalletTracker();
tracker.startTracking();
