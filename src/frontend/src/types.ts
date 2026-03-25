import type { Principal } from "@icp-sdk/core/principal";

export type ScriptCategory =
  | { __kind__: "DiscordBots" }
  | { __kind__: "WebScraping" }
  | { __kind__: "Automation" };

export interface Script {
  id: bigint;
  title: string;
  description: string;
  category: ScriptCategory;
  price: bigint;
  version: string;
  downloadUrl: string;
  languageTag: string;
  createdAt: bigint;
}

export interface Purchase {
  id: bigint;
  buyerPrincipal: Principal;
  scriptId: bigint;
  purchasedAt: bigint;
}
