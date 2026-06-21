import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
    setError("");
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    setLoading(true);
    setError("");
    const err = await updateProfile(
      firstName.trim(),
      lastName.trim(),
      email.trim(),
    );
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        data-ocid="settings.dialog"
        className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
      >
        {/* Header banner */}
        <div className="bg-gradient-to-br from-teal-primary to-teal-hero px-8 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Settings
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Update your profile information
          </p>
        </div>

        <div className="px-8 py-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="settings-first"
                  className="text-sm font-semibold"
                >
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="settings-first"
                    data-ocid="settings.firstname.input"
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-9 rounded-xl border-input focus:border-teal-primary"
                    required
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="settings-last"
                  className="text-sm font-semibold"
                >
                  Last Name
                </Label>
                <Input
                  id="settings-last"
                  data-ocid="settings.lastname.input"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border-input focus:border-teal-primary"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-email" className="text-sm font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="settings-email"
                  data-ocid="settings.email.input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 rounded-xl border-input focus:border-teal-primary"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <p
                data-ocid="settings.error_state"
                className="text-sm text-red-500 font-medium bg-red-50 rounded-xl px-3 py-2"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="settings.save_button"
              disabled={loading}
              className="w-full bg-teal-primary hover:bg-teal-dark text-white font-bold rounded-xl py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                "Saving…"
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
