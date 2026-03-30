import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function AppShell({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/account" className="logo">
          Ski Pass Account
        </Link>

        <nav className="nav-links">
          <NavLink to="/account">Аккаунт</NavLink>
          <NavLink to="/account/profile">Профиль</NavLink>
        </nav>

        <div className="header-actions">
          <div className="user-chip">
            <strong>{user?.first_name || user?.email}</strong>
            <span>{user?.role || "user"}</span>
          </div>
          <button type="button" className="secondary-button" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="app-content">{children}</main>
    </div>
  );
}