const LoadingDots = () => {
	return (
		<div className="flex justify-center">
			<div className="flex space-x-2">
				<div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-loading-dot" />
				<div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-loading-dot" />
				<div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-loading-dot" />
			</div>
		</div>
	);
};

export default LoadingDots;
