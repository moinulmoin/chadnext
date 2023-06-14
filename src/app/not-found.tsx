function NotFound() {
  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center py-24">
      <h1 className=" text-6xl font-bold">
        <span className="text-destructive">404</span>, Page{" "}
        <span className="text-destructive">Not Found</span>!
      </h1>
    </div>
  );
}

export default NotFound;
