import { getScopedI18n } from "~/locales/server";

async function NotFound() {
  const t = await getScopedI18n("notFound");
  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center py-24">
      <h1 className="text-center font-bold">
        <p className="mb-2 text-8xl text-destructive">404</p>{" "}
        <p className="text-5xl">{t("title")}</p>
      </h1>
    </div>
  );
}

export default NotFound;
