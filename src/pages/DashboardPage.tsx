import { Link } from "react-router-dom";
import { useProfileQuery } from "../features/auth/hooks";
import { useAuthStore } from "../store/authStore";
import { AppShell } from "../ui/AppShell";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const profileQuery = useProfileQuery();

  return (
    <AppShell>
      <section className="hero-card">
        <span className="eyebrow">Панель управления</span>
        <h1>Добро пожаловать</h1>
        <p>
          Это пример дашборда с авторизацией. Данные хранятся в Zustand, а
          серверные запросы обрабатываются через TanStack Query.
        </p>
        <Link to="/account/profile" className="primary-button inline-button">
          Мой профиль
        </Link>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <span>Email</span>
          <strong>{user?.email || "не задан"}</strong>
        </article>
        <article className="card stat-card">
          <span>Роль</span>
          <strong>{user?.role || "user"}</strong>
        </article>
        <article className="card stat-card">
          <span>Статус</span>
          <strong>{user?.status ? "активен" : "не активен"}</strong>
        </article>
      </section>

      <section className="card">
        <h2>Данные профиля</h2>
        {profileQuery.isLoading ? <p>Загрузка данных...</p> : null}
        {profileQuery.error ? (
          <p className="error-text">{profileQuery.error.message}</p>
        ) : null}
        {profileQuery.data ? (
          <pre className="code-block">
            {JSON.stringify(profileQuery.data, null, 2)}
          </pre>
        ) : null}
      </section>
    </AppShell>
  );
}