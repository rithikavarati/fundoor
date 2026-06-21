import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserPublic } from "../backend";

const AUTH_STORAGE_KEY = "fundoor_auth_user";
const GUEST_FAVORITES_KEY = "scoutplore_favorites";

interface AuthContextType {
  user: UserPublic | null;
  isLoggedIn: boolean;
  serverFavorites: Set<string>;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (
    firstName: string,
    lastName: string,
    email: string,
  ) => Promise<string | null>;
  forgotPassword: (
    email: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<string | null>;
  addFavorite: (activityId: string) => Promise<void>;
  removeFavorite: (activityId: string) => Promise<void>;
  isFavorite: (activityId: string) => boolean;
  toggleFavorite: (activityId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadPersistedUser(): UserPublic | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserPublic;
  } catch {
    return null;
  }
}

function persistUser(user: UserPublic | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function getGuestFavorites(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(() =>
    loadPersistedUser(),
  );
  const [serverFavorites, setServerFavorites] = useState<Set<string>>(
    new Set(),
  );
  const { actor, isFetching } = useActor(createActor);

  const fetchServerFavorites = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const favIds = await actor.getFavorites();
      setServerFavorites(new Set(favIds.map((id) => id.toString())));
    } catch {
      // ignore
    }
  }, [actor, isFetching]);

  // On mount / actor ready: if user is persisted, re-fetch their favorites
  useEffect(() => {
    if (user && actor && !isFetching) {
      fetchServerFavorites();
    }
  }, [user, actor, isFetching, fetchServerFavorites]);

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      if (!actor) return "Backend not available";
      try {
        const result = await actor.login(email, password);
        if (result.__kind__ === "ok") {
          const loggedInUser = result.ok;
          setUser(loggedInUser);
          persistUser(loggedInUser);

          // Fetch server favorites first, then merge guest favorites
          try {
            const favIds = await actor.getFavorites();
            const serverFavSet = new Set(favIds.map((id) => id.toString()));

            // Merge guest favorites into server
            const guestFavs = getGuestFavorites();
            for (const guestFav of guestFavs) {
              if (!serverFavSet.has(guestFav)) {
                try {
                  await actor.addFavorite(BigInt(guestFav));
                  serverFavSet.add(guestFav);
                } catch {
                  // ignore individual merge failures
                }
              }
            }
            setServerFavorites(serverFavSet);
            // Clear guest favorites after merge
            localStorage.removeItem(GUEST_FAVORITES_KEY);
          } catch {
            // ignore favorites fetch failure
          }

          return null;
        }
        return result.err;
      } catch (err) {
        return err instanceof Error ? err.message : "Login failed";
      }
    },
    [actor],
  );

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
    ): Promise<string | null> => {
      if (!actor) return "Backend not available";
      try {
        const result = await actor.register(
          firstName,
          lastName,
          email,
          password,
        );
        if (result.__kind__ === "ok") {
          const registeredUser = result.ok;
          setUser(registeredUser);
          persistUser(registeredUser);

          // Merge guest favorites into server (new account starts empty)
          try {
            const serverFavSet = new Set<string>();
            const guestFavs = getGuestFavorites();
            for (const guestFav of guestFavs) {
              try {
                await actor.addFavorite(BigInt(guestFav));
                serverFavSet.add(guestFav);
              } catch {
                // ignore individual merge failures
              }
            }
            setServerFavorites(serverFavSet);
            // Clear guest favorites after merge
            localStorage.removeItem(GUEST_FAVORITES_KEY);
          } catch {
            setServerFavorites(new Set());
          }

          return null;
        }
        return result.err;
      } catch (err) {
        return err instanceof Error ? err.message : "Registration failed";
      }
    },
    [actor],
  );

  const logout = useCallback(async () => {
    if (actor) {
      try {
        await actor.logout();
      } catch {
        // ignore
      }
    }
    setUser(null);
    persistUser(null);
    setServerFavorites(new Set());
  }, [actor]);

  const addFavorite = useCallback(
    async (activityId: string) => {
      if (!actor || !user) return;
      try {
        await actor.addFavorite(BigInt(activityId));
        setServerFavorites((prev) => new Set([...prev, activityId]));
      } catch {
        // ignore
      }
    },
    [actor, user],
  );

  const removeFavorite = useCallback(
    async (activityId: string) => {
      if (!actor || !user) return;
      try {
        await actor.removeFavorite(BigInt(activityId));
        setServerFavorites((prev) => {
          const next = new Set(prev);
          next.delete(activityId);
          return next;
        });
      } catch {
        // ignore
      }
    },
    [actor, user],
  );

  const isFavorite = useCallback(
    (activityId: string): boolean => {
      if (user) {
        return serverFavorites.has(activityId);
      }
      // Guest: check localStorage
      try {
        const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw) as string[];
        return parsed.includes(activityId);
      } catch {
        return false;
      }
    },
    [user, serverFavorites],
  );

  const toggleFavorite = useCallback(
    async (activityId: string) => {
      if (user) {
        if (serverFavorites.has(activityId)) {
          await removeFavorite(activityId);
        } else {
          await addFavorite(activityId);
        }
      } else {
        // Guest: toggle in localStorage
        try {
          const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
          const parsed: string[] = raw ? (JSON.parse(raw) as string[]) : [];
          const idx = parsed.indexOf(activityId);
          if (idx >= 0) {
            parsed.splice(idx, 1);
          } else {
            parsed.push(activityId);
          }
          localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
    },
    [user, serverFavorites, addFavorite, removeFavorite],
  );

  const updateProfile = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
    ): Promise<string | null> => {
      if (!actor) return "Backend not available";
      try {
        const result = await actor.updateUser(firstName, lastName, email);
        if (result.__kind__ === "ok") {
          const updatedUser = result.ok;
          setUser(updatedUser);
          persistUser(updatedUser);
          return null;
        }
        return result.err;
      } catch (err) {
        return err instanceof Error ? err.message : "Update failed";
      }
    },
    [actor],
  );

  const forgotPassword = useCallback(
    async (
      email: string,
      newPassword: string,
      confirmPassword: string,
    ): Promise<string | null> => {
      if (!actor) return "Backend not available";
      try {
        const result = await actor.forgotPassword(
          email,
          newPassword,
          confirmPassword,
        );
        if (result.__kind__ === "ok") {
          return null;
        }
        return result.err;
      } catch (err) {
        return err instanceof Error ? err.message : "Password reset failed";
      }
    },
    [actor],
  );

  const refreshFavorites = useCallback(async () => {
    if (user) {
      await fetchServerFavorites();
    }
  }, [user, fetchServerFavorites]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        serverFavorites,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return ctx;
}
