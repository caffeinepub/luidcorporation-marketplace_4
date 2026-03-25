import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "../backend";
import type { Purchase, Script, ScriptCategory } from "../types";
import { useActor } from "./useActor";

export function useListScripts() {
  const { actor, isFetching } = useActor();
  return useQuery<Script[]>({
    queryKey: ["scripts"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listScripts() as Promise<Script[]>;
    },
    enabled: !isFetching,
    initialData: [],
  });
}

export function useGetScript(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Script | null>({
    queryKey: ["script", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getScript(id) as Promise<Script | null>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => (actor ? actor.isCallerAdmin() : false),
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<{ username: string; email: string } | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => (actor ? actor.getCallerUserProfile() : null),
    enabled: !!actor && !isFetching,
  });
}

export function useMyPurchasedScripts() {
  const { actor, isFetching } = useActor();
  return useQuery<Script[]>({
    queryKey: ["myPurchasedScripts"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getMyPurchasedScripts() as Promise<Script[]>;
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useHasUserPurchased(scriptId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["hasPurchased", scriptId.toString()],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).hasUserPurchased(scriptId) as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<{ principal: Principal; username: string; email: string }[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listAllUsers() as Promise<
        { principal: Principal; username: string; email: string }[]
      >;
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useListAllPurchases() {
  const { actor, isFetching } = useActor();
  return useQuery<Purchase[]>({
    queryKey: ["allPurchases"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listAllPurchases() as Promise<Purchase[]>;
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useAddScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      title: string;
      description: string;
      category: ScriptCategory;
      price: bigint;
      version: string;
      downloadUrl: string;
      languageTag: string;
    }) =>
      (actor as any).addScript(
        vars.title,
        vars.description,
        vars.category,
        vars.price,
        vars.version,
        vars.downloadUrl,
        vars.languageTag,
      ) as Promise<bigint>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
}

export function useUpdateScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: bigint;
      title: string;
      description: string;
      category: ScriptCategory;
      price: bigint;
      version: string;
      downloadUrl: string;
      languageTag: string;
    }) =>
      (actor as any).updateScript(
        vars.id,
        vars.title,
        vars.description,
        vars.category,
        vars.price,
        vars.version,
        vars.downloadUrl,
        vars.languageTag,
      ) as Promise<boolean>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
}

export function useDeleteScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) =>
      (actor as any).deleteScript(id) as Promise<boolean>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
}

export function useRecordPurchase() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scriptId: bigint) =>
      (actor as any).recordPurchase(scriptId) as Promise<boolean>,
    onSuccess: (_, scriptId) => {
      qc.invalidateQueries({ queryKey: ["myPurchasedScripts"] });
      qc.invalidateQueries({ queryKey: ["hasPurchased", scriptId.toString()] });
    },
  });
}

export function useGrantPurchase() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { buyer: Principal; scriptId: bigint }) =>
      (actor as any).grantPurchase(
        vars.buyer,
        vars.scriptId,
      ) as Promise<boolean>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allPurchases"] }),
  });
}

export function useSaveCallerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: { username: string; email: string }) =>
      actor!.saveCallerUserProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerProfile"] }),
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { principal: Principal; role: UserRole }) =>
      actor!.assignCallerUserRole(vars.principal, vars.role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}
