export const Title = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1 className={`text-lg lg:text-3xl font-bold text-text ${className}`}>
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
    className={`text-lg lg:text-xl font-semibold text-text-secondary ${className}`}
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
    className={`text-sm lg:text-base font-newform-grotesk! font-medium text-text-secondary leading-relaxed ${className}`}
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
  <label className={`text-xs lg:text-sm font-medium text-text/80 ${className}`}>
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
