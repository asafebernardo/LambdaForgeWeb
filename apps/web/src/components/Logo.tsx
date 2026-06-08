import { LOGO_SRC, SITE_NAME } from "@/lib/config";

/** Width / height of the current logo asset. */
const LOGO_ASPECT = 513 / 642;

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 112, className = "" }: LogoProps) {
  const height = size;
  const width = Math.round(size * LOGO_ASPECT);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={SITE_NAME}
      width={width}
      height={height}
      decoding="async"
      fetchPriority="high"
      className={`object-contain ${className}`.trim()}
    />
  );
}
