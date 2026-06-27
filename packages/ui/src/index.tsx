"use client";

import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useState,
} from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({
  children,
  className,
  label,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cx("inline-flex items-center justify-center", className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx("inline-flex items-center justify-center", className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cx(
        "vstack-button",
        variant === "secondary" && "vstack-button-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export type CardProps = ComponentPropsWithoutRef<"div">;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cx("vstack-card", className)} {...props}>
      {children}
    </div>
  );
}

export function SoftCard({ children, className, ...props }: CardProps) {
  return (
    <div className={cx("vstack-card-soft", className)} {...props}>
      {children}
    </div>
  );
}

export type TextInputProps = ComponentPropsWithoutRef<"input">;

export function TextInput({
  className,
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <input className={cx("vstack-input", className)} type={type} {...props} />
  );
}

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cx("vstack-textarea", className)} {...props} />;
}

export type SelectProps = ComponentPropsWithoutRef<"select">;

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <select className={cx("vstack-select", className)} {...props}>
      {children}
    </select>
  );
}

export type BrandLockupProps = Omit<ComponentPropsWithoutRef<"a">, "title"> & {
  mark?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
};

export function BrandLockup({
  className,
  mark = "VS",
  subtitle,
  title,
  ...props
}: BrandLockupProps) {
  return (
    <a className={cx("vstack-brand", className)} {...props}>
      <span className="vstack-brand-mark">{mark}</span>
      <span className="vstack-brand-copy">
        <span className="vstack-brand-title">{title}</span>
        {subtitle ? (
          <span className="vstack-brand-subtitle">{subtitle}</span>
        ) : null}
      </span>
    </a>
  );
}

export type NavItem = {
  href: string;
  label: ReactNode;
  active?: boolean;
};

export type SiteHeaderProps = ComponentPropsWithoutRef<"header"> & {
  brandHref?: string;
  brandMark?: ReactNode;
  brandSubtitle?: ReactNode;
  brandTitle: ReactNode;
  navItems?: NavItem[];
  actions?: ReactNode;
};

export function SiteHeader({
  actions,
  brandHref = "/",
  brandMark,
  brandSubtitle,
  brandTitle,
  className,
  navItems = [],
  ...props
}: SiteHeaderProps) {
  return (
    <header className={cx("vstack-header", className)} {...props}>
      <div className="vstack-container vstack-card-soft vstack-header-inner">
        <BrandLockup
          href={brandHref}
          mark={brandMark}
          subtitle={brandSubtitle}
          title={brandTitle}
        />
        {navItems.length || actions ? (
          <nav aria-label="Primary" className="vstack-nav">
            {navItems.map((item) => (
              <a
                className={cx(
                  "vstack-nav-link",
                  item.active && "vstack-nav-link-active",
                )}
                href={item.href}
                key={`${item.href}-${String(item.label)}`}
              >
                {item.label}
              </a>
            ))}
            {actions}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

export type SiteFooterLink = {
  href: string;
  label: ReactNode;
};

export type SiteFooterProps = ComponentPropsWithoutRef<"footer"> & {
  copyright?: ReactNode;
  links?: SiteFooterLink[];
  subtitle?: ReactNode;
  title: ReactNode;
};

export function SiteFooter({
  className,
  copyright,
  links = [],
  subtitle,
  title,
  ...props
}: SiteFooterProps) {
  return (
    <footer className={cx("vstack-footer", className)} {...props}>
      <div className="vstack-container vstack-footer-inner">
        <div>
          <h2 className="vstack-footer-title">{title}</h2>
          {subtitle ? <p className="vstack-footer-copy">{subtitle}</p> : null}
        </div>
        <div className="vstack-stack">
          {links.length ? (
            <div className="vstack-nav">
              {links.map((link) => (
                <a className="vstack-nav-link" href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
          {copyright ? <p className="vstack-footer-copy">{copyright}</p> : null}
        </div>
      </div>
    </footer>
  );
}

export type SectionHeaderProps = ComponentPropsWithoutRef<"section"> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

export function SectionHeader({
  className,
  description,
  eyebrow,
  title,
  ...props
}: SectionHeaderProps) {
  return (
    <section className={cx("vstack-section-heading", className)} {...props}>
      {eyebrow ? (
        <span className="vstack-tag vstack-eyebrow">{eyebrow}</span>
      ) : null}
      <h1 className="vstack-title">{title}</h1>
      <div className="vstack-divider" />
      {description ? <p className="vstack-copy">{description}</p> : null}
    </section>
  );
}

export type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label = "Loading..." }: SpinnerProps) {
  return (
    <svg
      aria-hidden="true"
      className={cx("h-8 w-8 animate-spin", className)}
      fill="none"
      viewBox="0 0 100 101"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
      <title>{label}</title>
    </svg>
  );
}

export type LoadingIndicatorProps = {
  className?: string;
  label?: string;
  spinnerClassName?: string;
};

export function LoadingIndicator({
  className,
  label = "Loading...",
  spinnerClassName,
}: LoadingIndicatorProps) {
  return (
    <div className={cx("flex items-center justify-start", className)}>
      <div role="status">
        <Spinner
          className={cx(
            "mr-2 fill-[var(--accent)] text-[var(--accent-muted)]",
            spinnerClassName,
          )}
          label={label}
        />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

export type EmptyStateProps = ComponentPropsWithoutRef<"div"> & {
  title?: ReactNode;
  description?: ReactNode;
};

export function EmptyState({
  children,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cx("text-center", className)} {...props}>
      {title ? <div>{title}</div> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </div>
  );
}

export type NoticeProps = ComponentPropsWithoutRef<"div"> & {
  tone?: "neutral" | "success" | "error";
};

export function Notice({
  children,
  className,
  tone = "neutral",
  ...props
}: NoticeProps) {
  return (
    <div
      className={cx("rounded-md border px-3 py-2 text-sm", className)}
      data-tone={tone}
      {...props}
    >
      {children}
    </div>
  );
}

export type ConfigScreenProps = {
  title: ReactNode;
  message: ReactNode;
  className?: string;
  children?: ReactNode;
};

/**
 * Full-screen "this app is not configured" fallback. Render this instead of
 * crashing the build/prerender when a required env var (Clerk key, Convex URL,
 * etc.) is missing. Pair with the notice descriptors from `@vstack/auth`.
 */
export function ConfigScreen({
  title,
  message,
  className,
  children,
}: ConfigScreenProps) {
  return (
    <main
      className={cx(
        "flex min-h-screen items-center justify-center px-6",
        className,
      )}
    >
      <section className="max-w-md rounded-lg border px-6 py-5 text-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="mt-2 text-sm opacity-70">{message}</p>
        {children}
      </section>
    </main>
  );
}

export type ThemeToggleButtonProps = {
  className?: string;
  isDark: boolean;
  lightIcon: ReactNode;
  darkIcon: ReactNode;
  onToggle: () => void;
};

export function ThemeToggleButton({
  className,
  isDark,
  lightIcon,
  darkIcon,
  onToggle,
}: ThemeToggleButtonProps) {
  return (
    <IconButton
      className={className}
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
    >
      {isDark ? darkIcon : lightIcon}
    </IconButton>
  );
}

export type CopyButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  content: string;
  copiedLabel?: string;
  copyLabel?: string;
  copiedIcon?: ReactNode;
  copyIcon?: ReactNode;
  resetDelayMs?: number;
  onCopied?: () => void;
};

export function CopyButton({
  className,
  content,
  copiedIcon,
  copiedLabel = "Copied",
  copyIcon,
  copyLabel = "Copy",
  onCopied,
  resetDelayMs = 2000,
  type = "button",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(String(content).replace(/\n$/, ""));
    setCopied(true);
    onCopied?.();
    window.setTimeout(() => setCopied(false), resetDelayMs);
  }

  return (
    <button
      aria-label={copied ? copiedLabel : copyLabel}
      className={cx("inline-flex items-center justify-center", className)}
      onClick={copy}
      type={type}
      {...props}
    >
      {copied ? (copiedIcon ?? copiedLabel) : (copyIcon ?? copyLabel)}
    </button>
  );
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
  options: {
    deserialize?: (value: string) => T;
    serialize?: (value: T) => string;
  } = {},
) {
  const {
    deserialize = JSON.parse as (value: string) => T,
    serialize = JSON.stringify,
  } = options;
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;

    if (typeof window === "undefined") return fallback;

    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallback;

    try {
      return deserialize(stored);
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {}
  }, [key, serialize, value]);

  return [value, setValue] as const;
}

const readRawString = (value: string) => value;
const writeRawString = (value: string) => value;

export function useLocalStorageStringState(key: string, initialValue = "") {
  return useLocalStorageState(key, initialValue, {
    deserialize: readRawString,
    serialize: writeRawString,
  });
}
