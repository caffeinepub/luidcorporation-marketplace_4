import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetScript,
  useHasUserPurchased,
  useRecordPurchase,
} from "../hooks/useQueries";
import type { ScriptCategory } from "../types";

function categoryLabel(cat: ScriptCategory): string {
  if (cat.__kind__ === "DiscordBots") return "Discord Bot";
  if (cat.__kind__ === "WebScraping") return "Web Scraping";
  return "Automação";
}

function formatPrice(price: bigint): string {
  return `$ ${(Number(price) / 100).toFixed(2)}`;
}

export default function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const scriptId = BigInt(id ?? "0");

  const { data: script, isLoading } = useGetScript(scriptId);
  const { data: hasPurchased } = useHasUserPurchased(scriptId);
  const { mutateAsync: recordPurchase, isPending: isPurchasing } =
    useRecordPurchase();
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePurchase = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      await recordPurchase(scriptId);
      toast.success("Compra realizada! Download liberado.");
    } catch {
      toast.error("Erro ao processar compra.");
    }
  };

  const handleDownload = async () => {
    if (!actor) return;
    setIsDownloading(true);
    try {
      const url = await (actor as any).getDownloadUrl(scriptId);
      if (url) window.open(url, "_blank");
      else toast.error("URL de download não disponível.");
    } catch {
      toast.error("Erro ao obter link de download.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            data-ocid="product.button"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !script ? (
            <div className="text-center py-20" data-ocid="product.error_state">
              <h2 className="font-display font-bold text-2xl mb-2">
                Script não encontrado
              </h2>
              <p className="text-muted-foreground">
                O script que você procura não existe ou foi removido.
              </p>
              <Button
                className="mt-6"
                onClick={() => navigate({ to: "/" })}
                data-ocid="product.button"
              >
                Voltar ao Marketplace
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <Badge variant="outline" className="text-sm">
                      {script.languageTag}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {categoryLabel(script.category)}
                    </Badge>
                  </div>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
                    {script.title}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    {script.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Tag className="w-4 h-4" /> Versão {script.version}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />{" "}
                    {new Date(
                      Number(script.createdAt) / 1_000_000,
                    ).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="rounded-xl p-6 border border-border bg-white">
                  <h3 className="font-display font-bold text-lg mb-3">
                    Sobre este Script
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {script.description}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div
                  className="bg-white rounded-xl border border-border shadow-card p-6 sticky top-24"
                  data-ocid="product.card"
                >
                  <div
                    className="text-3xl font-display font-bold mb-2"
                    style={{ color: "#39FF14" }}
                  >
                    {formatPrice(script.price)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Acesso vitalício + todas as atualizações
                  </p>

                  {!identity ? (
                    <Button
                      onClick={() => login()}
                      className="w-full font-semibold h-12 rounded-xl"
                      style={{ background: "#39FF14", color: "#0B0F14" }}
                      data-ocid="product.primary_button"
                    >
                      Faça login para comprar
                    </Button>
                  ) : hasPurchased ? (
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full font-semibold h-12 rounded-xl"
                      style={{ background: "#39FF14", color: "#0B0F14" }}
                      data-ocid="product.primary_button"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Baixando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" /> Download ZIP
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="w-full font-semibold h-12 rounded-xl"
                      style={{ background: "#39FF14", color: "#0B0F14" }}
                      data-ocid="product.primary_button"
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Processando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" /> Comprar
                          Agora
                        </>
                      )}
                    </Button>
                  )}

                  {hasPurchased && (
                    <div
                      className="mt-4 p-3 rounded-lg text-sm text-center font-medium"
                      style={{
                        background: "rgba(57,255,20,0.1)",
                        color: "#22a000",
                      }}
                      data-ocid="product.success_state"
                    >
                      ✓ Você já possui este script
                    </div>
                  )}

                  <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <div>✓ Download imediato</div>
                    <div>✓ Suporte por e-mail</div>
                    <div>✓ Atualizações gratuitas</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
