import type { PropsWithChildren, ReactNode } from "react";

interface AuthCardProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <div className="card auth-card">
      <div className="card-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
      {footer ? <div className="card-footer">{footer}</div> : null}
    </div>
  );
}
