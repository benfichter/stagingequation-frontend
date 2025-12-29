type FullHouseLogoProps = {
  className?: string;
  title?: string;
};

export default function FullHouseLogo({ className, title = "Staging Equation" }: FullHouseLogoProps) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
    >
      <path
        d="M 40 160 L 40 95 L 100 50 L 120 70 L 120 45 L 145 45 L 145 95 L 170 120 L 170 160 L 40 160 Z"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
