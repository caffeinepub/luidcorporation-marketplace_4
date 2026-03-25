/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export type UserRole = { 'admin' : null } | { 'user' : null } | { 'guest' : null };
export type ScriptCategory = { 'DiscordBots' : null } | { 'WebScraping' : null } | { 'Automation' : null };
export interface Script {
  'id' : bigint,
  'title' : string,
  'description' : string,
  'category' : ScriptCategory,
  'price' : bigint,
  'version' : string,
  'downloadUrl' : string,
  'languageTag' : string,
  'createdAt' : bigint,
}
export interface Purchase {
  'id' : bigint,
  'buyerPrincipal' : Principal,
  'scriptId' : bigint,
  'purchasedAt' : bigint,
}
export interface _CaffeineStorageCreateCertificateResult { 'method' : string, 'blob_hash' : string }
export interface _CaffeineStorageRefillInformation { 'proposed_top_up_amount' : [] | [bigint] }
export interface _CaffeineStorageRefillResult { 'success' : [] | [boolean], 'topped_up_amount' : [] | [bigint] }
export interface _SERVICE {
  '_caffeineStorageBlobIsLive' : ActorMethod<[Uint8Array], boolean>,
  '_caffeineStorageBlobsToDelete' : ActorMethod<[], Array<Uint8Array>>,
  '_caffeineStorageConfirmBlobDeletion' : ActorMethod<[Array<Uint8Array>], undefined>,
  '_caffeineStorageCreateCertificate' : ActorMethod<[string], _CaffeineStorageCreateCertificateResult>,
  '_caffeineStorageRefillCashier' : ActorMethod<[[] | [_CaffeineStorageRefillInformation]], _CaffeineStorageRefillResult>,
  '_caffeineStorageUpdateGatewayPrincipals' : ActorMethod<[], undefined>,
  '_initializeAccessControlWithSecret' : ActorMethod<[string], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'getCallerUserProfile' : ActorMethod<[], [] | [{ 'username' : string, 'email' : string }]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'saveCallerUserProfile' : ActorMethod<[{ 'username' : string, 'email' : string }], undefined>,
  'addScript' : ActorMethod<[string, string, ScriptCategory, bigint, string, string, string], bigint>,
  'updateScript' : ActorMethod<[bigint, string, string, ScriptCategory, bigint, string, string, string], boolean>,
  'deleteScript' : ActorMethod<[bigint], boolean>,
  'listScripts' : ActorMethod<[], Array<Script>>,
  'getScript' : ActorMethod<[bigint], [] | [Script]>,
  'grantPurchase' : ActorMethod<[Principal, bigint], boolean>,
  'recordPurchase' : ActorMethod<[bigint], boolean>,
  'getMyPurchasedScripts' : ActorMethod<[], Array<Script>>,
  'getDownloadUrl' : ActorMethod<[bigint], [] | [string]>,
  'hasUserPurchased' : ActorMethod<[bigint], boolean>,
  'listAllPurchases' : ActorMethod<[], Array<Purchase>>,
  'listAllUsers' : ActorMethod<[], Array<{ 'principal' : Principal, 'username' : string, 'email' : string }>>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
