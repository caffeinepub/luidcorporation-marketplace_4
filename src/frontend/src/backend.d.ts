import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
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

export interface backendInterface {
    // Auth
    registerCaller(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<{ username: string; email: string } | null>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: { username: string; email: string }): Promise<void>;
    // Scripts
    addScript(title: string, description: string, category: ScriptCategory, price: bigint, version: string, downloadUrl: string, languageTag: string): Promise<bigint>;
    updateScript(id: bigint, title: string, description: string, category: ScriptCategory, price: bigint, version: string, downloadUrl: string, languageTag: string): Promise<boolean>;
    deleteScript(id: bigint): Promise<boolean>;
    listScripts(): Promise<Script[]>;
    getScript(id: bigint): Promise<Script | null>;
    // Purchases
    grantPurchase(buyer: Principal, scriptId: bigint): Promise<boolean>;
    recordPurchase(scriptId: bigint): Promise<boolean>;
    getMyPurchasedScripts(): Promise<Script[]>;
    getDownloadUrl(scriptId: bigint): Promise<string | null>;
    hasUserPurchased(scriptId: bigint): Promise<boolean>;
    listAllPurchases(): Promise<Purchase[]>;
    listAllUsers(): Promise<{ principal: Principal; username: string; email: string }[]>;
}
