import Balancer from "react-wrap-balancer";
import { ToolIcons } from "../shared/tool-icons";
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
              File uploading and more in Next.js 13 app dir.
            </Balancer>
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <ToolIcons.nextjs />
            <div className="space-y-2">
              <h3 className="font-bold">Next.js 13</h3>
              <p className="text-sm text-muted-foreground">
                App dir, Routing, Layouts, API routes, Server Components, Server
                actions.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <ToolIcons.shadcnUI />
            <div className="space-y-2">
              <h3 className="font-bold">Shadcn UI</h3>
              <p className="text-sm text-muted-foreground">
                UI components built using Radix UI and styled with Tailwind CSS.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <ToolIcons.prisma />
            <div className="space-y-2">
              <h3 className="font-bold">Database</h3>
              <p className="text-sm text-muted-foreground">
                Using Postgres with Prisma ORM, hosted on Vercel Postgres.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <ToolIcons.authjs />
            <div className="space-y-2">
              <h3 className="font-bold">Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Authentication using NextAuth.js and middlewares.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <ToolIcons.uploadthing />
            <div className="space-y-2">
              <h3 className="font-bold">File Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload and preview files effortlessly with UploadThing.
              </p>
            </div>
          </Card>
          <Card className="flex h-[180px] flex-col justify-between p-6">
            <ToolIcons.resend />
            <div className="space-y-2">
              <h3 className="font-bold">Emails</h3>
              <p className="text-sm text-muted-foreground">
                Create emails using React Email and Send with Resend.
              </p>
            </div>
          </Card>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            ChadNext also includes changelog page built using Contentlayer and
            MDX.
          </p>
        </div>
      </div>
    </section>
  );
}
