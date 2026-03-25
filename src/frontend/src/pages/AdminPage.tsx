import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  Code,
  Edit2,
  Gift,
  Loader2,
  Plus,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddScript,
  useAssignUserRole,
  useDeleteScript,
  useGrantPurchase,
  useIsCallerAdmin,
  useListAllPurchases,
  useListAllUsers,
  useListScripts,
  useUpdateScript,
} from "../hooks/useQueries";
import type { Script, ScriptCategory } from "../types";

type CategoryKey = "DiscordBots" | "WebScraping" | "Automation";

function makeCategoryVariant(key: CategoryKey): ScriptCategory {
  return { __kind__: key } as ScriptCategory;
}

function categoryLabel(cat: ScriptCategory): string {
  if (cat.__kind__ === "DiscordBots") return "Discord Bot";
  if (cat.__kind__ === "WebScraping") return "Web Scraping";
  return "Automação";
}

function formatPrice(price: bigint): string {
  return `$ ${(Number(price) / 100).toFixed(2)}`;
}

const defaultForm = {
  title: "",
  description: "",
  category: "DiscordBots" as CategoryKey,
  price: "",
  version: "1.0.0",
  downloadUrl: "",
  languageTag: "",
};

type FormState = typeof defaultForm;

function ScriptFormDialog({
  open,
  onClose,
  editScript,
}: {
  open: boolean;
  onClose: () => void;
  editScript?: Script | null;
}) {
  const [form, setForm] = useState<FormState>(
    editScript
      ? {
          title: editScript.title,
          description: editScript.description,
          category: editScript.category.__kind__ as CategoryKey,
          price: String(Number(editScript.price)),
          version: editScript.version,
          downloadUrl: editScript.downloadUrl,
          languageTag: editScript.languageTag,
        }
      : defaultForm,
  );

  const { mutateAsync: addScript, isPending: isAdding } = useAddScript();
  const { mutateAsync: updateScript, isPending: isUpdating } =
    useUpdateScript();
  const isPending = isAdding || isUpdating;

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = makeCategoryVariant(form.category);
    const price = BigInt(Math.round(Number(form.price)));
    try {
      if (editScript) {
        await updateScript({
          id: editScript.id,
          title: form.title,
          description: form.description,
          category,
          price,
          version: form.version,
          downloadUrl: form.downloadUrl,
          languageTag: form.languageTag,
        });
        toast.success("Script atualizado!");
      } else {
        await addScript({
          title: form.title,
          description: form.description,
          category,
          price,
          version: form.version,
          downloadUrl: form.downloadUrl,
          languageTag: form.languageTag,
        });
        toast.success("Script adicionado!");
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar script.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {editScript ? "Editar Script" : "Adicionar Script"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              data-ocid="admin.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              required
              data-ocid="admin.textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update("category", v)}
              >
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DiscordBots">Discord Bots</SelectItem>
                  <SelectItem value="WebScraping">Web Scraping</SelectItem>
                  <SelectItem value="Automation">Automação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Preço (centavos)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="2999"
                required
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Versão</Label>
              <Input
                value={form.version}
                onChange={(e) => update("version", e.target.value)}
                required
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Linguagem</Label>
              <Input
                value={form.languageTag}
                onChange={(e) => update("languageTag", e.target.value)}
                placeholder="Python"
                required
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>URL de Download</Label>
            <Input
              value={form.downloadUrl}
              onChange={(e) => update("downloadUrl", e.target.value)}
              placeholder="https://..."
              required
              data-ocid="admin.input"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="admin.cancel_button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 font-semibold"
              style={{ background: "#39FF14", color: "#0B0F14" }}
              data-ocid="admin.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GrantPurchaseDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [buyerPrincipal, setBuyerPrincipal] = useState("");
  const [scriptId, setScriptId] = useState("");
  const { mutateAsync: grantPurchase, isPending } = useGrantPurchase();
  const { data: scripts } = useListScripts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      const buyer: Principal = Principal.fromText(buyerPrincipal);
      await grantPurchase({ buyer, scriptId: BigInt(scriptId) });
      toast.success("Compra concedida!");
      onClose();
    } catch {
      toast.error("Erro ao conceder compra.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Conceder Compra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Principal do Usuário</Label>
            <Input
              value={buyerPrincipal}
              onChange={(e) => setBuyerPrincipal(e.target.value)}
              placeholder="xxxx-xxxx-..."
              required
              data-ocid="admin.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Script</Label>
            <Select value={scriptId} onValueChange={setScriptId}>
              <SelectTrigger data-ocid="admin.select">
                <SelectValue placeholder="Selecionar script" />
              </SelectTrigger>
              <SelectContent>
                {scripts.map((s) => (
                  <SelectItem key={s.id.toString()} value={s.id.toString()}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="admin.cancel_button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 font-semibold"
              style={{ background: "#39FF14", color: "#0B0F14" }}
              data-ocid="admin.submit_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Conceder"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const { data: scripts, isLoading: scriptsLoading } = useListScripts();
  const { data: users } = useListAllUsers();
  const { data: purchases } = useListAllPurchases();
  const { mutateAsync: deleteScript } = useDeleteScript();
  const { mutateAsync: assignRole } = useAssignUserRole();

  const [showScriptForm, setShowScriptForm] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);

  if (!identity) {
    navigate({ to: "/login" });
    return null;
  }
  if (!adminLoading && !isAdmin) {
    navigate({ to: "/" });
    return null;
  }

  const handleDelete = async (id: bigint) => {
    try {
      await deleteScript(id);
      toast.success("Script excluído.");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  const handleToggleAdmin = async (principal: Principal) => {
    try {
      await assignRole({ principal, role: UserRole.user });
      toast.success("Cargo atualizado!");
    } catch {
      toast.error("Erro ao atualizar cargo.");
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(57,255,20,0.12)" }}
              >
                <Code className="w-5 h-5" style={{ color: "#39FF14" }} />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie scripts, usuários e vendas
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {[
                { label: "Scripts", value: scripts.length, icon: Code },
                { label: "Usuários", value: users.length, icon: Users },
                { label: "Vendas", value: purchases.length, icon: ShoppingBag },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <span className="font-display font-bold text-2xl">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <Tabs defaultValue="scripts">
            <TabsList className="mb-6" data-ocid="admin.tab">
              <TabsTrigger value="scripts" data-ocid="admin.tab">
                <Code className="w-4 h-4 mr-2" />
                Scripts
              </TabsTrigger>
              <TabsTrigger value="users" data-ocid="admin.tab">
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="sales" data-ocid="admin.tab">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Vendas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scripts">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">
                  Scripts ({scripts.length})
                </h2>
                <Button
                  onClick={() => {
                    setEditingScript(null);
                    setShowScriptForm(true);
                  }}
                  className="gap-2 font-semibold"
                  style={{ background: "#39FF14", color: "#0B0F14" }}
                  data-ocid="admin.primary_button"
                >
                  <Plus className="w-4 h-4" /> Adicionar Script
                </Button>
              </div>
              {scriptsLoading ? (
                <div
                  className="py-12 text-center text-muted-foreground"
                  data-ocid="admin.loading_state"
                >
                  Carregando...
                </div>
              ) : scripts.length === 0 ? (
                <div
                  className="py-12 text-center text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  Nenhum script cadastrado. Adicione o primeiro!
                </div>
              ) : (
                <div
                  className="bg-white rounded-xl border border-border overflow-hidden"
                  data-ocid="admin.table"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Versão</TableHead>
                        <TableHead>Linguagem</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scripts.map((script, i) => (
                        <TableRow
                          key={script.id.toString()}
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {script.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {categoryLabel(script.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className="font-semibold"
                              style={{ color: "#39FF14" }}
                            >
                              {formatPrice(script.price)}
                            </span>
                          </TableCell>
                          <TableCell>v{script.version}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {script.languageTag}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingScript(script);
                                  setShowScriptForm(true);
                                }}
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                    data-ocid={`admin.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent data-ocid="admin.dialog">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir Script
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir "
                                      {script.title}"? Esta ação não pode ser
                                      desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-ocid="admin.cancel_button">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(script.id)}
                                      className="bg-destructive text-destructive-foreground"
                                      data-ocid="admin.confirm_button"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">
                  Usuários ({users.length})
                </h2>
                <Button
                  onClick={() => setShowGrantDialog(true)}
                  variant="outline"
                  className="gap-2"
                  data-ocid="admin.secondary_button"
                >
                  <Gift className="w-4 h-4" /> Conceder Compra
                </Button>
              </div>
              {users.length === 0 ? (
                <div
                  className="py-12 text-center text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  Nenhum usuário cadastrado.
                </div>
              ) : (
                <div
                  className="bg-white rounded-xl border border-border overflow-hidden"
                  data-ocid="admin.table"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Principal</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, i) => {
                        const principalStr = user.principal.toString();
                        const short = `${principalStr.slice(0, 8)}...${principalStr.slice(-6)}`;
                        return (
                          <TableRow
                            key={principalStr}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {short}
                            </TableCell>
                            <TableCell className="font-medium">
                              {user.username || "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.email || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleToggleAdmin(user.principal)
                                }
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                Gerenciar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sales">
              <h2 className="font-display font-bold text-lg mb-4">
                Vendas ({purchases.length})
              </h2>
              {purchases.length === 0 ? (
                <div
                  className="py-12 text-center text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  Nenhuma venda registrada.
                </div>
              ) : (
                <div
                  className="bg-white rounded-xl border border-border overflow-hidden"
                  data-ocid="admin.table"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead>Script ID</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((p, i) => {
                        const buyerStr = p.buyerPrincipal.toString();
                        return (
                          <TableRow
                            key={p.id.toString()}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs">
                              #{p.id.toString()}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {buyerStr.slice(0, 8)}...{buyerStr.slice(-6)}
                            </TableCell>
                            <TableCell>
                              Script #{p.scriptId.toString()}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(
                                Number(p.purchasedAt) / 1_000_000,
                              ).toLocaleDateString("pt-BR")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      <ScriptFormDialog
        open={showScriptForm}
        onClose={() => {
          setShowScriptForm(false);
          setEditingScript(null);
        }}
        editScript={editingScript}
      />
      <GrantPurchaseDialog
        open={showGrantDialog}
        onClose={() => setShowGrantDialog(false)}
      />
    </div>
  );
}
