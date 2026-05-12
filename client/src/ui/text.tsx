export const Title = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1
    className={`text-2xl lg:text-3xl font-semibold tracking-tight text-text ${className}`}
  >
    {children}
  </h1>
);

export const Subtitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={`text-lg lg:text-xl font-medium tracking-tight text-text ${className}`}
  >
    {children}
  </h2>
);

export const Description = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`text-sm lg:text-base text-text-secondary leading-relaxed ${className}`}
  >
    {children}
  </p>
);

export const Label = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    className={`font-newform-mono! text-[11px] uppercase tracking-[0.18em] text-text-secondary ${className}`}
  >
    {children}
  </label>
);

export const Text = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-sm lg:text-base text-text ${className}`}>{children}</p>
);
