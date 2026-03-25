import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveCallerProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({
  open,
  onComplete,
}: ProfileSetupModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { mutateAsync, isPending } = useSaveCallerProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    try {
      await mutateAsync({ username: username.trim(), email: email.trim() });
      toast.success("Perfil criado com sucesso!");
      onComplete();
    } catch {
      toast.error("Erro ao salvar perfil");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" data-ocid="profile_setup.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Complete seu Perfil
          </DialogTitle>
          <DialogDescription>
            Bem-vindo ao LuidCorporation Scripts! Insira seus dados para
            continuar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seunome"
              data-ocid="profile_setup.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              data-ocid="profile_setup.input"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-semibold"
            style={{ background: "#39FF14", color: "#0B0F14" }}
            data-ocid="profile_setup.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
              </>
            ) : (
              "Salvar Perfil"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
