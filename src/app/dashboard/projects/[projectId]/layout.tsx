import GoBack from "~/components/go-back";

export default function SingleProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoBack />
      {children}
    </>
  );
}
