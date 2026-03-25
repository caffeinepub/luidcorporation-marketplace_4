/* eslint-disable */
// @ts-nocheck
import { IDL } from '@icp-sdk/core/candid';

export const _CaffeineStorageCreateCertificateResult = IDL.Record({ 'method' : IDL.Text, 'blob_hash' : IDL.Text });
export const _CaffeineStorageRefillInformation = IDL.Record({ 'proposed_top_up_amount' : IDL.Opt(IDL.Nat) });
export const _CaffeineStorageRefillResult = IDL.Record({ 'success' : IDL.Opt(IDL.Bool), 'topped_up_amount' : IDL.Opt(IDL.Nat) });
export const UserRole = IDL.Variant({ 'admin' : IDL.Null, 'user' : IDL.Null, 'guest' : IDL.Null });
export const ScriptCategory = IDL.Variant({ 'DiscordBots' : IDL.Null, 'WebScraping' : IDL.Null, 'Automation' : IDL.Null });
export const Script = IDL.Record({
  'id' : IDL.Nat,
  'title' : IDL.Text,
  'description' : IDL.Text,
  'category' : ScriptCategory,
  'price' : IDL.Nat,
  'version' : IDL.Text,
  'downloadUrl' : IDL.Text,
  'languageTag' : IDL.Text,
  'createdAt' : IDL.Int,
});
export const Purchase = IDL.Record({
  'id' : IDL.Nat,
  'buyerPrincipal' : IDL.Principal,
  'scriptId' : IDL.Nat,
  'purchasedAt' : IDL.Int,
});

export const idlService = IDL.Service({
  '_caffeineStorageBlobIsLive' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], ['query']),
  '_caffeineStorageBlobsToDelete' : IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ['query']),
  '_caffeineStorageConfirmBlobDeletion' : IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
  '_caffeineStorageCreateCertificate' : IDL.Func([IDL.Text], [_CaffeineStorageCreateCertificateResult], []),
  '_caffeineStorageRefillCashier' : IDL.Func([IDL.Opt(_CaffeineStorageRefillInformation)], [_CaffeineStorageRefillResult], []),
  '_caffeineStorageUpdateGatewayPrincipals' : IDL.Func([], [], []),
  '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
  'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
  'getCallerUserProfile' : IDL.Func([], [IDL.Opt(IDL.Record({ 'username' : IDL.Text, 'email' : IDL.Text }))], ['query']),
  'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
  'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
  'saveCallerUserProfile' : IDL.Func([IDL.Record({ 'username' : IDL.Text, 'email' : IDL.Text })], [], []),
  'addScript' : IDL.Func([IDL.Text, IDL.Text, ScriptCategory, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  'updateScript' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, ScriptCategory, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  'deleteScript' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'listScripts' : IDL.Func([], [IDL.Vec(Script)], ['query']),
  'getScript' : IDL.Func([IDL.Nat], [IDL.Opt(Script)], ['query']),
  'grantPurchase' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
  'recordPurchase' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'getMyPurchasedScripts' : IDL.Func([], [IDL.Vec(Script)], ['query']),
  'getDownloadUrl' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Text)], ['query']),
  'hasUserPurchased' : IDL.Func([IDL.Nat], [IDL.Bool], ['query']),
  'listAllPurchases' : IDL.Func([], [IDL.Vec(Purchase)], []),
  'listAllUsers' : IDL.Func([], [IDL.Vec(IDL.Record({ 'principal' : IDL.Principal, 'username' : IDL.Text, 'email' : IDL.Text }))], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const ScriptCategory = IDL.Variant({ 'DiscordBots' : IDL.Null, 'WebScraping' : IDL.Null, 'Automation' : IDL.Null });
  const Script = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'description' : IDL.Text,
    'category' : ScriptCategory,
    'price' : IDL.Nat,
    'version' : IDL.Text,
    'downloadUrl' : IDL.Text,
    'languageTag' : IDL.Text,
    'createdAt' : IDL.Int,
  });
  const Purchase = IDL.Record({
    'id' : IDL.Nat,
    'buyerPrincipal' : IDL.Principal,
    'scriptId' : IDL.Nat,
    'purchasedAt' : IDL.Int,
  });
  const _CaffeineStorageCreateCertificateResult = IDL.Record({ 'method' : IDL.Text, 'blob_hash' : IDL.Text });
  const _CaffeineStorageRefillInformation = IDL.Record({ 'proposed_top_up_amount' : IDL.Opt(IDL.Nat) });
  const _CaffeineStorageRefillResult = IDL.Record({ 'success' : IDL.Opt(IDL.Bool), 'topped_up_amount' : IDL.Opt(IDL.Nat) });
  const UserRole = IDL.Variant({ 'admin' : IDL.Null, 'user' : IDL.Null, 'guest' : IDL.Null });
  return IDL.Service({
    '_caffeineStorageBlobIsLive' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], ['query']),
    '_caffeineStorageBlobsToDelete' : IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ['query']),
    '_caffeineStorageConfirmBlobDeletion' : IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
    '_caffeineStorageCreateCertificate' : IDL.Func([IDL.Text], [_CaffeineStorageCreateCertificateResult], []),
    '_caffeineStorageRefillCashier' : IDL.Func([IDL.Opt(_CaffeineStorageRefillInformation)], [_CaffeineStorageRefillResult], []),
    '_caffeineStorageUpdateGatewayPrincipals' : IDL.Func([], [], []),
    '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(IDL.Record({ 'username' : IDL.Text, 'email' : IDL.Text }))], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'saveCallerUserProfile' : IDL.Func([IDL.Record({ 'username' : IDL.Text, 'email' : IDL.Text })], [], []),
    'addScript' : IDL.Func([IDL.Text, IDL.Text, ScriptCategory, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'updateScript' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, ScriptCategory, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    'deleteScript' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'listScripts' : IDL.Func([], [IDL.Vec(Script)], ['query']),
    'getScript' : IDL.Func([IDL.Nat], [IDL.Opt(Script)], ['query']),
    'grantPurchase' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'recordPurchase' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getMyPurchasedScripts' : IDL.Func([], [IDL.Vec(Script)], ['query']),
    'getDownloadUrl' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Text)], ['query']),
    'hasUserPurchased' : IDL.Func([IDL.Nat], [IDL.Bool], ['query']),
    'listAllPurchases' : IDL.Func([], [IDL.Vec(Purchase)], []),
    'listAllUsers' : IDL.Func([], [IDL.Vec(IDL.Record({ 'principal' : IDL.Principal, 'username' : IDL.Text, 'email' : IDL.Text }))], []),
  });
};

export const init = ({ IDL }) => { return []; };
