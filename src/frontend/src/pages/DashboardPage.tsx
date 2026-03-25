import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Loader2, Package, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCallerProfile,
  useIsCallerAdmin,
  useMyPurchasedScripts,
} from "../hooks/useQueries";
import type { Script, ScriptCategory } from "../types";

function categoryLabel(cat: ScriptCategory): string {
  if (cat.__kind__ === "DiscordBots") return "Discord Bot";
  if (cat.__kind__ === "WebScraping") return "Web Scraping";
  return "Automação";
}

function formatPrice(price: bigint): string {
  return `$ ${(Number(price) / 100).toFixed(2)}`;
}

function PurchasedScriptCard({
  script,
  index,
}: { script: Script; index: number }) {
  const { actor } = useActor();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!actor) return;
    setIsDownloading(true);
    try {
      const url = await (actor as any).getDownloadUrl(script.id);
      if (url) window.open(url, "_blank");
      else toast.error("URL de download não disponível.");
    } catch {
      toast.error("Erro ao baixar.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="bg-white rounded-xl border border-border shadow-card p-5 flex flex-col sm:flex-row gap-4"
      data-ocid={`dashboard.item.${index + 1}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="font-display font-bold text-base truncate">
            {script.title}
          </h3>
          <Badge variant="outline" className="shrink-0 text-xs">
            {script.languageTag}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {script.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{categoryLabel(script.category)}</span>
          <span>·</span>
          <span>v{script.version}</span>
          <span>·</span>
          <span className="font-semibold" style={{ color: "#39FF14" }}>
            {formatPrice(script.price)}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="sm"
          className="font-semibold rounded-full px-5 h-9"
          style={{ background: "#39FF14", color: "#0B0F14" }}
          data-ocid={`dashboard.button.${index + 1}`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Baixando
            </>
          ) : (
            <>
              <Download className="w-3 h-3 mr-1.5" /> Download ZIP
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: purchases, isLoading: purchasesLoading } =
    useMyPurchasedScripts();
  const { data: isAdmin } = useIsCallerAdmin();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-6)}`
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-border shadow-card p-6 mb-8"
            data-ocid="dashboard.card"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(57,255,20,0.12)" }}
              >
                <User className="w-7 h-7" style={{ color: "#39FF14" }} />
              </div>
              <div className="flex-1">
                {profileLoading ? (
                  <>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-52" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display font-bold text-xl">
                        {profile?.username ?? "Usuário"}
                      </h2>
                      {isAdmin && (
                        <Badge
                          className="gap-1"
                          style={{ background: "#39FF14", color: "#0B0F14" }}
                        >
                          <Shield className="w-3 h-3" /> Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email ?? shortPrincipal}
                    </p>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfileModal(true)}
                data-ocid="dashboard.edit_button"
              >
                Editar Perfil
              </Button>
            </div>
          </motion.div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5" style={{ color: "#39FF14" }} />
              <h2 className="font-display font-bold text-xl">Meus Scripts</h2>
              <Badge variant="outline">{purchases.length}</Badge>
            </div>

            {purchasesLoading ? (
              <div className="space-y-4" data-ocid="dashboard.loading_state">
                {["sk-1", "sk-2"].map((k) => (
                  <div
                    key={k}
                    className="bg-white rounded-xl border border-border p-5"
                  >
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : purchases.length === 0 ? (
              <div
                className="text-center py-16 bg-white rounded-xl border border-border"
                data-ocid="dashboard.empty_state"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(57,255,20,0.1)" }}
                >
                  <Package className="w-8 h-8" style={{ color: "#39FF14" }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  Nenhum script ainda
                </h3>
                <p className="text-muted-foreground text-sm">
                  Explore o marketplace e adquira seu primeiro script!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((script, i) => (
                  <PurchasedScriptCard
                    key={script.id.toString()}
                    script={script}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ProfileSetupModal
        open={showProfileModal}
        onComplete={() => setShowProfileModal(false)}
      />
    </div>
  );
}
