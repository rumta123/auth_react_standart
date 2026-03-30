import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../features/auth/hooks";
import { ApiError } from "../lib/api";
import {
  type RegisterFormValues,
  registerSchema,
} from "../features/auth/validators";
import { AuthCard } from "../ui/AuthCard";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 3l18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-4.1 4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.7 6.8A17.2 17.2 0 0 0 2 12s3.5 7 10 7c1.7 0 3.1-.4 4.4-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getRegisterFieldError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("phone") ||
    normalizedMessage.includes("телефон") ||
    normalizedMessage.includes("users_phone_key")
  ) {
    return {
      field: "phone" as const,
      message: "Такой телефон уже зарегистрирован в системе",
    };
  }

  if (
    normalizedMessage.includes("email") ||
    normalizedMessage.includes("email") ||
    normalizedMessage.includes("users_email_key")
  ) {
    return {
      field: "email" as const,
      message: "Email уже зарегистрирован в системе",
    };
  }

  return null;
}

export function RegisterPage() {
  const registerMutation = useRegisterMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      phone: "",
      birth_date: "",
      // Значения по умолчанию (для типизации, но мы их переопределим при отправке)
      role: "user",
      status: true,
    },
  });

  useEffect(() => {
    const error = registerMutation.error;

    if (!(error instanceof ApiError)) {
      return;
    }

    const fieldError = getRegisterFieldError(error.message);
    if (!fieldError) {
      return;
    }

    setError(fieldError.field, {
      type: "server",
      message: fieldError.message,
    });
  }, [registerMutation.error, setError]);

  const onSubmit = handleSubmit((values) => {
    clearErrors(["email", "phone"]);
    
    // 🔒 КРИТИЧЕСКИ ВАЖНО: Принудительно устанавливаем роль и статус
    // Это гарантирует, что даже если кто-то изменит код фронтенда, 
    // новый пользователь не сможет дать себе права администратора
    registerMutation.mutate({
      ...values,
      role: "user",
      status: true,
    });
  });

  return (
    <AuthCard
      title="Регистрация"
      subtitle="Создайте новый аккаунт с валидацией Zod"
      footer={
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      }
    >
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="split-grid">
          <label className="field">
            <span>Имя</span>
            <input type="text" placeholder="Иван" {...register("first_name")} />
            {errors.first_name ? <small>{errors.first_name.message}</small> : null}
          </label>

          <label className="field">
            <span>Фамилия</span>
            <input type="text" placeholder="Иванов" {...register("last_name")} />
            {errors.last_name ? <small>{errors.last_name.message}</small> : null}
          </label>
        </div>

        <label className="field">
          <span>Отчество</span>
          <input type="text" placeholder="Иванович" {...register("middle_name")} />
          {errors.middle_name ? <small>{errors.middle_name.message}</small> : null}
        </label>

        <div className="split-grid">
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="user@example.com" {...register("email")} />
            {errors.email ? <small>{errors.email.message}</small> : null}
          </label>

          <label className="field">
            <span>Телефон</span>
            <input type="tel" placeholder="+79991234567" {...register("phone")} />
            {errors.phone ? <small>{errors.phone.message}</small> : null}
          </label>
        </div>

        <label className="field">
          <span>Дата рождения</span>
          <input type="date" {...register("birth_date")} />
          {errors.birth_date ? <small>{errors.birth_date.message}</small> : null}
        </label>

        {/* Поле "Роль" удалено из интерфейса */}

        <label className="field">
          <span>Пароль</span>
          <div className="password-input-wrap">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Минимум 6 символов"
              {...register("password")}
            />
            <button
              type="button"
              className="password-toggle icon-button"
              onClick={() => setIsPasswordVisible((value) => !value)}
              aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
              title={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            >
              <EyeIcon open={isPasswordVisible} />
            </button>
          </div>
          {errors.password ? <small>{errors.password.message}</small> : null}
        </label>

        {/* Чекбокс "Статус" удален из интерфейса */}

        {registerMutation.error && !errors.email && !errors.phone ? (
          <div className="error-banner">{registerMutation.error.message}</div>
        ) : null}

        <button
          type="submit"
          className="primary-button"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Регистрация..." : "Создать аккаунт"}
        </button>
      </form>
    </AuthCard>
  );
}