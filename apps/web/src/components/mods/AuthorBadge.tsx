import Link from "next/link";

interface AuthorBadgeProps {
  username: string;
}

export function AuthorBadge({ username }: AuthorBadgeProps) {
  return (
    <Link
      href={`/users/${username}`}
      className="rounded bg-white/5 px-2 py-0.5 text-xs text-muted no-underline hover:text-accent"
    >
      @{username}
    </Link>
  );
}
