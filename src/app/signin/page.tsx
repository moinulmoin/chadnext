import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import AuthForm from "~/components/layout/auth-form";

export default function page() {
  return (
    <Card className="flex min-h-[calc(100vh-140px)] items-center justify-center md:min-h-[calc(100vh-160px)]">
      <CardContent className="w-[400px]">
        <CardHeader>
          <CardTitle className="pb-4">
            <div className="flex items-center">
              <Image
                src="/chad-next.png"
                alt="ChadNext logo"
                width="24"
                height="24"
                className="mr-2 rounded-sm object-contain"
              />
              <p>ChadNext</p>
            </div>
          </CardTitle>
        </CardHeader>
        <AuthForm />
      </CardContent>
    </Card>
  );
}
