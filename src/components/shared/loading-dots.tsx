const LoadingDots = () => {
  return (
    <div className="flex justify-center">
      <div className="flex space-x-2">
        <div className="animate-loading-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />
        <div className="animate-loading-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />
        <div className="animate-loading-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />
      </div>
    </div>
  );
};

export default LoadingDots;
