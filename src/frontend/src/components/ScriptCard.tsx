import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Script, ScriptCategory } from "../types";

function categoryLabel(cat: ScriptCategory): string {
  if (cat.__kind__ === "DiscordBots") return "Discord Bot";
  if (cat.__kind__ === "WebScraping") return "Web Scraping";
  return "Automação";
}

function formatPrice(price: bigint): string {
  return `$ ${(Number(price) / 100).toFixed(2)}`;
}

interface ScriptCardProps {
  script: Script;
  index?: number;
}

export default function ScriptCard({ script, index = 0 }: ScriptCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
      onClick={() =>
        navigate({ to: "/product/$id", params: { id: script.id.toString() } })
      }
    >
      {/* Top */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-foreground text-base leading-snug line-clamp-2">
            {script.title}
          </h3>
          <Badge
            variant="outline"
            className="shrink-0 text-xs font-semibold border-foreground/20 text-foreground/70"
          >
            {script.languageTag}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {script.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-1">
          <span className="text-xs text-muted-foreground">
            {categoryLabel(script.category)}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            v{script.version}
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <span
          className="font-display font-bold text-lg px-3 py-0.5 rounded-full"
          style={{ background: "#39FF14", color: "#0B0F14" }}
        >
          {formatPrice(script.price)}
        </span>
        <Button
          size="sm"
          className="font-semibold rounded-full px-5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "#39FF14", color: "#0B0F14" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate({
              to: "/product/$id",
              params: { id: script.id.toString() },
            });
          }}
          data-ocid="script_card.button"
        >
          Detalhes
        </Button>
      </div>
    </motion.div>
  );
}
