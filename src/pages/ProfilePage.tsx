import { useProfileQuery } from "../features/auth/hooks";
import { useAuthStore } from "../store/authStore";
import { AppShell } from "../ui/AppShell";

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data ?? user;

  return (
    <AppShell>
      <section className="card profile-card">
        <div className="card-header">
          <h1>Личные данные</h1>
          <p>Данные получены из `/auth/profile`.</p>
        </div>

        {profileQuery.isLoading ? <p>Загрузка данных...</p> : null}
        {profileQuery.error ? (
          <p className="error-text">{profileQuery.error.message}</p>
        ) : null}

        {profile ? (
          <div className="profile-grid">
            <ProfileRow label="ID" value={String(profile.user_id)} />
            <ProfileRow label="Email" value={profile.email} />
            <ProfileRow label="Имя" value={profile.first_name || "не указано"} />
            <ProfileRow label="Фамилия" value={profile.last_name || "не указано"} />
            <ProfileRow
              label="Отчество"
              value={profile.middle_name || "не указано"}
            />
            <ProfileRow label="Телефон" value={profile.phone || "не указано"} />
            <ProfileRow
              label="Дата рождения"
              value={profile.birth_date || "не указано"}
            />
            <ProfileRow label="Роль" value={profile.role || "user"} />
            <ProfileRow
              label="Статус"
              value={profile.status ? "активен" : "не активен"}
            />
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}