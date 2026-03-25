import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const scrollToGrid = () => {
    const el = document.getElementById("scripts-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{
        background: "linear-gradient(135deg, #0B0F14 0%, #1A1F2A 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5"
            onClick={() => navigate({ to: "/" })}
            data-ocid="nav.link"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-lg"
              style={{ background: "#39FF14", color: "#0B0F14" }}
            >
              L
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-white text-sm tracking-wider">
                LUIDCORPORATION
              </span>
              <span
                className="font-display font-bold text-sm tracking-wider"
                style={{ color: "#39FF14" }}
              >
                SCRIPTS
              </span>
            </div>
          </button>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button
              type="button"
              className="text-sm text-white/70 hover:text-white transition-colors font-medium bg-transparent border-0 p-0"
              onClick={() => navigate({ to: "/" })}
              data-ocid="nav.link"
            >
              Home
            </button>
            <button
              type="button"
              onClick={scrollToGrid}
              className="text-sm text-white/70 hover:text-white transition-colors font-medium cursor-pointer bg-transparent border-0 p-0"
              data-ocid="nav.link"
            >
              Explorar Scripts
            </button>
            {isAdmin && (
              <button
                type="button"
                className="text-sm transition-colors font-medium bg-transparent border-0 p-0"
                style={{ color: "#39FF14" }}
                onClick={() => navigate({ to: "/admin" })}
                data-ocid="nav.link"
              >
                Admin
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {identity ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white bg-transparent hover:bg-white/10 gap-1.5"
                    data-ocid="nav.button"
                  >
                    Minha Conta <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44"
                  data-ocid="nav.dropdown_menu"
                >
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/dashboard" })}
                    data-ocid="nav.link"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin" })}
                      data-ocid="nav.link"
                    >
                      <Shield className="w-4 h-4 mr-2" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                    data-ocid="nav.link"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="hidden sm:flex border-white/20 text-white bg-transparent hover:bg-white/10"
                  data-ocid="nav.button"
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="font-semibold rounded-full px-5"
                  style={{ background: "#39FF14", color: "#0B0F14" }}
                  data-ocid="nav.primary_button"
                >
                  {isLoggingIn ? "Conectando..." : "Começar"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
