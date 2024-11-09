import { LanguagesIcon } from "lucide-react";
import { BrandIcons } from "../shared/brand-icons";
import { Card } from "../ui/card";
import { getScopedI18n } from "~/locales/server";

export default async function Features() {
  const scopedT = await getScopedI18n("features");
  const scopedTlibs = await getScopedI18n("features.libs");

  return (
    <section>
      <div className="container space-y-6 rounded-md bg-secondary py-14 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl">
            {scopedT("top")}
          </h2>
          <p className="max-w-[85%] text-balance leading-normal text-primary/70 sm:text-lg sm:leading-7">
            {scopedT("details")}
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 text-center sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.nextjs />
            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("nextjs")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.shadcnUI />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("tailwindcss")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.prisma />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("postgres")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.luciaAuth />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("lucia")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.uploadthing />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("uploadthing")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <BrandIcons.resend />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("reactEmail")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <LanguagesIcon className="mx-auto h-12 w-12 fill-current" />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("internationalization")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <BrandIcons.stripe />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("stripe")}
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <BrandIcons.vercel />

            <p className="text-balance text-sm text-muted-foreground">
              {scopedTlibs("vercel")}
            </p>
          </Card>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-primary/70 sm:text-lg sm:leading-7">
            {scopedT('aboutMd')}
            <a
              href="https://velite.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Velite
            </a>{" "}
            and Markdown.
          </p>
        </div>
      </div>
    </section>
  );
}
