import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useLoginMutation } from "../features/auth/hooks";
import {
  type LoginFormValues,
  loginSchema,
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

export function LoginPage() {
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return (
    <AuthCard
      title="Вход"
      subtitle="Авторизация через NestJS API с использованием JWT"
      footer={
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      }
    >
      <form className="form-grid" onSubmit={onSubmit}>
        {location.state?.registered ? (
          <div className="success-banner">
            Регистрация успешна. Войдите под своим аккаунтом.
          </div>
        ) : null}

        <label className="field">
          <span>Email</span>
          <input type="email" placeholder="user@example.com" {...register("email")} />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>

        <label className="field">
          <span>Пароль</span>
          <div className="password-input-wrap">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Введите пароль"
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

        {loginMutation.error ? (
          <div className="error-banner">{loginMutation.error.message}</div>
        ) : null}

        <button type="submit" className="primary-button" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Вход..." : "Войти"}
        </button>
      </form>
    </AuthCard>
  );
}