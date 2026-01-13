function Button({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-6 py-2.5 rounded-xl bg-primary outline-solid hover:bg-primary-hover active:bg-primary-dark outline-primary-dark/0 active:outline-primary-dark/30 flex justify-center items-center ${className} cursor-pointer`}
    >
      <span className="text-primary-glow select-none">{children}</span>
    </div>
  );
}

export default Button;
