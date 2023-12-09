"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icons from "../shared/icons";

// const userAuthSchema = z.object({
//   email: z.string().email("Please enter a valid email address."),
// });

// type FormData = z.infer<typeof userAuthSchema>;

export default function AuthForm() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [isGithubLoading, setIsGithubLoading] = useState(false);

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(userAuthSchema),
  // });

  // async function onSubmit(data: FormData) {
  //   setIsLoading(true);

  //   saCheckEmailExists(data.email.toLowerCase())
  //     .then(async () => {
  //       try {
  //         const res = await signIn("email", {
  //           email: data.email.toLowerCase(),
  //           redirect: false,
  //         });

  //         if (!res?.ok) {
  //           throw new Error("Something went wrong.");
  //         }

  //         toast({
  //           title: "Check your email",
  //           description:
  //             "We sent you a sign in link. Be sure to check your spam too.",
  //         });
  //         reset();
  //       } catch (err) {
  //         toast({
  //           title: "Something went wrong.",
  //           description: "Your signin request failed. Please try again.",
  //           variant: "destructive",
  //         });
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch(() => {
  //       toast({
  //         title: "Account not found.",
  //         description:
  //           "You have to use the email already linked to your account.",
  //         variant: "destructive",
  //       });
  //       setIsLoading(false);
  //     });
  // }
  return (
    <div className={cn("mt-4 flex flex-col gap-4")}>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2.5">
          <div>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              disabled={isLoading || isGithubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="mt-2 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading || isGithubLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send magic link
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div> */}
      <Link
        href="/api/auth/login/github"
        className={cn(buttonVariants({ variant: "outline" }))}
        // onClick={() => {
        //   setIsGithubLoading(true);
        //   signIn("github");
        // }}
        // disabled={isLoading || isGithubLoading}
      >
        {/* {isGithubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "} */}
        Continue with <Icons.gitHub className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}
