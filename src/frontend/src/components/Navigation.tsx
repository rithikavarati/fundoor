import { Menu, Settings, Star, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CategoryType } from "../App";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import SettingsModal from "./SettingsModal";

interface NavigationProps {
  onCategorySelect: (category: CategoryType) => void;
  selectedCategory: CategoryType;
}

const NAV_LINKS: { label: string; category: CategoryType }[] = [
  { label: "Discover", category: "All" },
  { label: "Favorites", category: "Favorites" },
  { label: "Theme Parks", category: "Theme Parks" },
  { label: "Weekend Activities", category: "Weekend Activities" },
  { label: "Parks", category: "Parks" },
  { label: "Museums", category: "Museums" },
];

export default function Navigation({
  onCategorySelect,
  selectedCategory,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-kiddoYellow text-kiddoYellow" />
                <span className="text-2xl font-extrabold text-teal-primary tracking-tight">
                  Fun<span className="text-kiddoOrange">Door</span>
                </span>
                <Star className="w-4 h-4 fill-kiddoYellow text-kiddoYellow" />
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.category}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
                  onClick={() => onCategorySelect(link.category)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === link.category
                      ? "text-teal-primary bg-secondary"
                      : "text-foreground hover:text-teal-primary hover:bg-secondary/60"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Person / Auth */}
              <div className="relative" ref={userMenuRef}>
                {isLoggedIn && user ? (
                  <button
                    type="button"
                    data-ocid="nav.user_menu.toggle"
                    aria-label="User menu"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-primary/10 hover:bg-teal-primary/20 border border-teal-primary/20 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-teal-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    data-ocid="nav.auth.open_modal_button"
                    aria-label="Sign in"
                    onClick={() => setAuthModalOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-all duration-200 border border-border"
                  >
                    <User className="w-5 h-5 text-foreground" />
                  </button>
                )}
                {isLoggedIn && user && userMenuOpen && (
                  <div
                    data-ocid="nav.user_menu.popover"
                    className="absolute right-0 top-12 w-52 bg-card rounded-2xl shadow-2xl border border-border py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-sm font-bold text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      data-ocid="nav.settings.button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      type="button"
                      data-ocid="nav.logout.button"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                data-ocid="nav.mobile_menu.toggle"
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-all"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-border px-4 pb-4 pt-2">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.category}
                data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
                onClick={() => {
                  onCategorySelect(link.category);
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === link.category
                    ? "text-teal-primary bg-secondary"
                    : "text-foreground hover:text-teal-primary hover:bg-secondary/60"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </>
  );
}
