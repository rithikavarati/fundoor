import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, register, forgotPassword } = useAuth();

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [showSignInPw, setShowSignInPw] = useState(false);

  // Register state
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);

  // Forgot password state
  const [fpEmail, setFpEmail] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [showFpNewPw, setShowFpNewPw] = useState(false);
  const [showFpConfirmPw, setShowFpConfirmPw] = useState(false);

  function resetAll() {
    setSignInEmail("");
    setSignInPassword("");
    setSignInError("");
    setRegFirstName("");
    setRegLastName("");
    setRegEmail("");
    setRegPassword("");
    setRegError("");
    setForgotOpen(false);
    setForgotSuccess(false);
    setFpEmail("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpError("");
    setFpLoading(false);
    setShowFpNewPw(false);
    setShowFpConfirmPw(false);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword) return;
    setSignInLoading(true);
    setSignInError("");
    const err = await login(signInEmail.trim(), signInPassword);
    setSignInLoading(false);
    if (err) {
      setSignInError(err);
    } else {
      resetAll();
      onClose();
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (
      !regFirstName.trim() ||
      !regLastName.trim() ||
      !regEmail.trim() ||
      !regPassword
    )
      return;
    setRegLoading(true);
    setRegError("");
    const err = await register(
      regFirstName.trim(),
      regLastName.trim(),
      regEmail.trim(),
      regPassword,
    );
    setRegLoading(false);
    if (err) {
      setRegError(err);
    } else {
      resetAll();
      onClose();
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFpError("");
    if (!fpEmail.trim()) {
      setFpError("Email is required");
      return;
    }
    if (!fpNewPassword) {
      setFpError("New password is required");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match");
      return;
    }
    setFpLoading(true);
    const err = await forgotPassword(
      fpEmail.trim(),
      fpNewPassword,
      fpConfirmPassword,
    );
    setFpLoading(false);
    if (err) {
      setFpError(err);
    } else {
      setForgotSuccess(true);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          resetAll();
          onClose();
        }
      }}
    >
      <DialogContent
        data-ocid="auth.dialog"
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
            Welcome to FunDoor
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Sign in to save your favorite adventures
          </p>
        </div>

        <div className="px-8 py-6">
          <Tabs defaultValue="signin">
            <TabsList className="w-full mb-6 bg-muted rounded-xl p-1">
              <TabsTrigger
                value="signin"
                data-ocid="auth.signin.tab"
                className="flex-1 rounded-lg text-sm font-semibold data-[state=active]:bg-teal-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                data-ocid="auth.register.tab"
                className="flex-1 rounded-lg text-sm font-semibold data-[state=active]:bg-teal-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* ─── Sign In ─── */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="signin-email"
                    className="text-sm font-semibold"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      data-ocid="auth.signin.email.input"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-9 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signin-password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      data-ocid="auth.signin.password.input"
                      type={showSignInPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPw((v) => !v)}
                      aria-label={
                        showSignInPw ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showSignInPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {signInError && (
                  <p
                    data-ocid="auth.signin.error_state"
                    className="text-sm text-red-500 font-medium bg-red-50 rounded-xl px-3 py-2"
                  >
                    {signInError}
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="auth.signin.submit_button"
                  disabled={signInLoading}
                  className="w-full bg-teal-primary hover:bg-teal-dark text-white font-bold rounded-xl py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {signInLoading ? "Signing in…" : "Sign In"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    data-ocid="auth.forgot_password.open_modal_button"
                    onClick={() => setForgotOpen(true)}
                    className="text-sm text-teal-primary hover:text-teal-dark font-medium underline underline-offset-2 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* ─── Register ─── */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-first"
                      className="text-sm font-semibold"
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reg-first"
                        data-ocid="auth.register.firstname.input"
                        type="text"
                        placeholder="Jane"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="pl-9 rounded-xl border-input focus:border-teal-primary"
                        required
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-last" className="text-sm font-semibold">
                      Last Name
                    </Label>
                    <Input
                      id="reg-last"
                      data-ocid="auth.register.lastname.input"
                      type="text"
                      placeholder="Doe"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      className="rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-email" className="text-sm font-semibold">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      data-ocid="auth.register.email.input"
                      type="email"
                      placeholder="you@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="pl-9 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      data-ocid="auth.register.password.input"
                      type={showRegPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPw((v) => !v)}
                      aria-label={showRegPw ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showRegPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {regError && (
                  <p
                    data-ocid="auth.register.error_state"
                    className="text-sm text-red-500 font-medium bg-red-50 rounded-xl px-3 py-2"
                  >
                    {regError}
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="auth.register.submit_button"
                  disabled={regLoading}
                  className="w-full bg-teal-primary hover:bg-teal-dark text-white font-bold rounded-xl py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {regLoading ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Forgot Password dialog */}
      <Dialog
        open={forgotOpen}
        onOpenChange={(v) => {
          if (!v) {
            setForgotOpen(false);
            setForgotSuccess(false);
            setFpEmail("");
            setFpNewPassword("");
            setFpConfirmPassword("");
            setFpError("");
            setFpLoading(false);
          }
        }}
      >
        <DialogContent
          data-ocid="auth.forgot_password.dialog"
          className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        >
          <div className="bg-gradient-to-br from-teal-primary to-teal-hero px-8 py-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {forgotSuccess ? "Success" : "Reset Password"}
            </h2>
          </div>

          <div className="px-8 py-6">
            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your email and a new password to reset your account.
                </p>

                <div className="space-y-1.5">
                  <Label htmlFor="fp-email" className="text-sm font-semibold">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fp-email"
                      data-ocid="auth.forgot_password.email.input"
                      type="email"
                      placeholder="you@example.com"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      className="pl-9 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="fp-new-password"
                    className="text-sm font-semibold"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fp-new-password"
                      data-ocid="auth.forgot_password.new_password.input"
                      type={showFpNewPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFpNewPw((v) => !v)}
                      aria-label={
                        showFpNewPw ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showFpNewPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="fp-confirm-password"
                    className="text-sm font-semibold"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fp-confirm-password"
                      data-ocid="auth.forgot_password.confirm_password.input"
                      type={showFpConfirmPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={fpConfirmPassword}
                      onChange={(e) => setFpConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl border-input focus:border-teal-primary"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFpConfirmPw((v) => !v)}
                      aria-label={
                        showFpConfirmPw ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showFpConfirmPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {fpError && (
                  <p
                    data-ocid="auth.forgot_password.error_state"
                    className="text-sm text-red-500 font-medium bg-red-50 rounded-xl px-3 py-2"
                  >
                    {fpError}
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="auth.forgot_password.submit_button"
                  disabled={fpLoading}
                  className="w-full bg-teal-primary hover:bg-teal-dark text-white font-bold rounded-xl py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {fpLoading ? "Resetting…" : "Reset Password"}
                </Button>

                <button
                  type="button"
                  data-ocid="auth.forgot_password.back_button"
                  onClick={() => setForgotOpen(false)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your password has been updated successfully.
                </p>
                <Button
                  data-ocid="auth.forgot_password.back_to_signin_button"
                  onClick={() => {
                    setForgotOpen(false);
                    setForgotSuccess(false);
                    setFpEmail("");
                    setFpNewPassword("");
                    setFpConfirmPassword("");
                    setFpError("");
                  }}
                  className="w-full bg-teal-primary hover:bg-teal-dark text-white font-bold rounded-xl py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
