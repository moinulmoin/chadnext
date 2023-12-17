import Balancer from "react-wrap-balancer";
import { BrandIcons } from "../shared/brand-icons";
import { Card } from "../ui/card";

export default function Features() {
  return (
    <section id="features">
      <div className="container space-y-6 rounded-md bg-secondary py-8 md:py-12 lg:py-24 ">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            <Balancer>
              This template comes with features like Authentication, API routes,
              File uploading and more in Next.js App dir.
            </Balancer>
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 text-center sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.nextjs />
            <p className="text-sm text-muted-foreground">
              App dir, Routing, Layouts, API routes, Server Components, Server
              actions.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.shadcnUI />

            <p className="text-sm text-muted-foreground">
              UI components built using Radix UI and styled with Tailwind CSS.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.prisma />

            <p className="text-sm text-muted-foreground">
              Using Postgres with Prisma ORM, hosted on Vercel Postgres.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.luciaAuth />

            <p className="text-sm text-muted-foreground">
              Authentication and Authorization using LuciaAuth.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between rounded-md p-6">
            <BrandIcons.uploadthing />

            <p className="text-sm text-muted-foreground">
              Upload and preview files effortlessly with UploadThing.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <BrandIcons.resend />

            <p className="text-sm text-muted-foreground">
              Create emails using React Email and Send with Resend.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <BrandIcons.stripe />

            <p className="text-sm text-muted-foreground">
              Receive and process payments with Stripe.
            </p>
          </Card>
          <Card className="flex h-[160px] flex-col justify-between p-6">
            <BrandIcons.vercel />

            <p className="text-sm text-muted-foreground">
              Production and Preview deployments with Vercel.
            </p>
          </Card>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            ChadNext also includes changelog page built using Contentlayer and
            Markdown.
          </p>
        </div>
      </div>
    </section>
  );
}
