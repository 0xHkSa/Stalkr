"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3 = __importStar(require("@solana/web3.js"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const SOLANA_RPC_ENDPOINT = process.env.SOLANA_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
// Tracked Wallets
const TRACKED_WALLETS = [
    "GY3AxLwJtXMKEcs6iRauT4C6oPtivjjhRQjtAxtWeNx9",
    "4zq1iLpmepj2Rj7W6A3XQMRQA1HyjYqVpZiBzM6aPyH7",
];
class WalletTracker {
    constructor() {
        this.connection = new web3.Connection(SOLANA_RPC_ENDPOINT, "confirmed");
    }
    startTracking() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Stalkr Initialized, scanning...");
            for (const wallet of TRACKED_WALLETS) {
                const pubkey = new web3.PublicKey(wallet);
                this.connection.onLogs(pubkey, (logs, context) => {
                    this.handleTransaction(wallet, logs, context);
                }, "confirmed");
                console.log(`Targeting: ${wallet}`);
            }
        });
    }
    handleTransaction(wallet, logs, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(`\n New trasaction for wallet: ${wallet}`);
            // console.log(`Signature: ${context.signature}`);
            console.log(`Slot: ${context.slot}`);
            console.log("Logs: ", logs);
            logs.logs.forEach((log) => console.log(log));
            try {
                const transaction = yield this.connection.getTransaction(logs.signature, {
                    maxSupportedTransactionVersion: 0,
                });
                if (transaction && transaction.meta) {
                    const preBalance = transaction.meta.preBalances[0] || 0;
                    const postBalance = transaction.meta.postBalances[0] || 0;
                    console.log(`Amount: ${((_a = transaction.meta) === null || _a === void 0 ? void 0 : _a.postBalances[0]) - ((_b = transaction.meta) === null || _b === void 0 ? void 0 : _b.preBalances[0])} lamports`);
                }
            }
            catch (error) {
                console.error("Error fetching transaction details:", error);
            }
            console.log("----------------------------------------");
        });
    }
}
const tracker = new WalletTracker();
tracker.startTracking();
