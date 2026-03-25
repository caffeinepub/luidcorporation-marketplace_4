import { useNavigate } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="text-white/70" style={{ background: "#0B0F14" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-lg"
                style={{ background: "#39FF14", color: "#0B0F14" }}
              >
                L
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-xs tracking-wider">
                  LUIDCORPORATION
                </span>
                <span
                  className="font-display font-bold text-xs tracking-wider"
                  style={{ color: "#39FF14" }}
                >
                  SCRIPTS
                </span>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              O marketplace definitivo para scripts e ferramentas de automação
              profissionais.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Carreiras
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Explorar Scripts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Preços
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Central de Ajuda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Contato
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="hover:text-white transition-colors bg-transparent border-0 p-0"
                  data-ocid="footer.link"
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>
            © {year} LuidCorporation Scripts. Todos os direitos reservados.
          </span>
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
