import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfileSetupModal from "../components/ProfileSetupModal";
import ScriptCard from "../components/ScriptCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useListScripts } from "../hooks/useQueries";

const CATEGORIES = [
  { label: "Todos", value: "all" },
  { label: "Discord Bots", value: "DiscordBots" },
  { label: "Web Scraping", value: "WebScraping" },
  { label: "Automação", value: "Automation" },
];

const POPULAR_TAGS = ["Python", "Node.js", "Bash", "Discord"];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: scripts, isLoading } = useListScripts();
  const { data: profile } = useCallerProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (identity && !isInitializing && profile === null) {
      setShowProfileModal(true);
    }
  }, [identity, isInitializing, profile]);

  const filtered = scripts.filter((s) => {
    const matchSearch =
      search.trim() === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.languageTag.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "all" || s.category.__kind__ === activeCategory;
    return matchSearch && matchCat;
  });

  const scrollToGrid = () => {
    const el = document.getElementById("scripts-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-[600px] flex items-center justify-center pt-16"
        style={{
          background: "linear-gradient(135deg, #0B0F14 0%, #1A1F2A 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,15,20,0.3) 0%, rgba(11,15,20,0.85) 100%)",
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-20">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#39FF14" }}
          >
            LuidCorporation Marketplace
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4"
          >
            Descubra & Adquira
            <br />
            <span style={{ color: "#39FF14" }}>Scripts Profissionais</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg mb-10 leading-relaxed"
          >
            O marketplace definitivo para scripts e ferramentas de automação
            profissionais.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-xl mx-auto mb-8"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") scrollToGrid();
              }}
              placeholder="Buscar scripts, linguagens..."
              className="w-full h-14 pl-6 pr-16 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#39FF14] focus:bg-white/15 transition-all text-base"
              data-ocid="hero.search_input"
            />
            <button
              type="button"
              onClick={scrollToGrid}
              className="absolute right-2 top-2 h-10 w-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: "#39FF14" }}
              data-ocid="hero.button"
            >
              <Search className="w-5 h-5" style={{ color: "#0B0F14" }} />
            </button>
          </motion.div>

          {/* Popular tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-white/50 text-sm">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setSearch(tag)}
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 text-white/70 hover:border-[#39FF14] hover:text-[#39FF14] transition-colors"
                data-ocid="hero.toggle"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Scripts Grid */}
      <main className="flex-1 bg-background" id="scripts-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl mb-3">
              Explore Nosso Marketplace
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Scripts e automações prontos para uso, desenvolvidos por
              especialistas.
            </p>
          </div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap gap-2 justify-center mb-8"
            data-ocid="scripts.tab"
          >
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat.value
                    ? "border-transparent text-[#0B0F14]"
                    : "border-border text-foreground hover:border-[#39FF14]"
                }`}
                style={
                  activeCategory === cat.value ? { background: "#39FF14" } : {}
                }
                data-ocid="scripts.tab"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {["a", "b", "c", "d"].map((k) => (
                <div
                  key={k}
                  className="bg-white rounded-xl border border-border p-5 space-y-3"
                >
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" data-ocid="scripts.empty_state">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
                style={{ background: "rgba(57,255,20,0.12)" }}
              >
                🚀
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Nenhum script encontrado
              </h3>
              <p className="text-muted-foreground">
                {search
                  ? "Tente outros termos de busca."
                  : "O admin ainda não adicionou scripts. Volte em breve!"}
              </p>
              {scripts.length === 0 && (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="mt-6 px-6 py-2.5 rounded-full font-semibold text-sm"
                  style={{ background: "#39FF14", color: "#0B0F14" }}
                  data-ocid="scripts.primary_button"
                >
                  Entrar como Admin
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((script, i) => (
                <ScriptCard
                  key={script.id.toString()}
                  script={script}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA Banner */}
      <section
        className="py-16 px-4"
        style={{
          background: "linear-gradient(135deg, #0B0F14 0%, #1A1F2A 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl mb-4">
            Pronto para automatizar seu trabalho?
          </h2>
          <p className="text-white/60 mb-8">
            Crie sua conta gratuitamente e acesse o melhor da automação
            profissional.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="px-8 py-3.5 rounded-full font-display font-bold text-base"
            style={{ background: "#39FF14", color: "#0B0F14" }}
            data-ocid="cta.primary_button"
          >
            Começar Agora →
          </button>
        </div>
      </section>

      <Footer />
      <ProfileSetupModal
        open={showProfileModal}
        onComplete={() => setShowProfileModal(false)}
      />
    </div>
  );
}
