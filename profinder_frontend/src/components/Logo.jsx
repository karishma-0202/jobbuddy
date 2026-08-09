const Logo = ({ className = "", ...props }) => {
  return (
    <h2
      className={`text-3xl sm:text-4xl md:text-5xl font-black text-blue-500 hover:text-blue-400 ${className}`}
      {...props}
    >
      JobBuddy
    </h2>
  );
};

export default Logo;
