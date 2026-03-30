import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <section className="brand-panel">
        <span className="eyebrow">Ski Pass</span>
        <h1>Единая система управления аккаунтами</h1>
        <p>
          Быстрый вход, основанный на современных стандартах безопасности с использованием JWT.
        </p>
        <div className="brand-actions">
          <Link to="/login" className="ghost-link">
            Войти
          </Link>
          <Link to="/register" className="ghost-link">
            Создать аккаунт
          </Link>
        </div>
      </section>

      <section className="form-panel">
        <Outlet />
      </section>
    </div>
  );
}