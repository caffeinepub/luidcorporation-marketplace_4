import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import Footer from "../components/Footer";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, identity, isLoggingIn, isLoginSuccess } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccess || identity) {
      navigate({ to: "/dashboard" });
    }
  }, [isLoginSuccess, identity, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0B0F14 0%, #1A1F2A 100%)",
      }}
    >
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center"
          data-ocid="login.card"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-2xl"
              style={{ background: "#39FF14", color: "#0B0F14" }}
            >
              L
            </div>
            <div className="flex flex-col items-start">
              <span className="font-display font-bold text-foreground text-xs tracking-wider">
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

          <h1 className="font-display font-bold text-2xl text-foreground mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Acesse com sua Internet Identity para continuar.
          </p>

          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-8"
            style={{
              background: "rgba(57,255,20,0.08)",
              border: "1px solid rgba(57,255,20,0.2)",
            }}
          >
            <ShieldCheck
              className="w-5 h-5 shrink-0"
              style={{ color: "#39FF14" }}
            />
            <p className="text-sm text-left text-foreground/70">
              Login seguro via{" "}
              <span className="font-semibold text-foreground">
                Internet Identity
              </span>{" "}
              — sem senhas, totalmente descentralizado.
            </p>
          </div>

          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-12 font-display font-bold text-base rounded-full"
            style={{ background: "#39FF14", color: "#0B0F14" }}
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando...
              </>
            ) : (
              "Entrar com Internet Identity"
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            Ao entrar, você concorda com nossos Termos de Uso e Política de
            Privacidade.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
