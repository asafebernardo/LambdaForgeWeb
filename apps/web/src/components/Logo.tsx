import { LOGO_SRC, SITE_NAME } from "@/lib/config";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 112, className = "" }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={SITE_NAME}
      width={size}
      height={size}
      decoding="async"
      fetchPriority="high"
      className={`object-contain ${className}`.trim()}
    />
  );
}
