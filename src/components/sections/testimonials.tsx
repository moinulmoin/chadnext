import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const testimonials = [
  {
    name: "John Doe",
    role: "Full Stack Developer",
    content: "ChadNext has saved me weeks of setup time. The best starter template I've ever used!",
    avatar: "https://github.com/shadcn.png",
    initials: "JD",
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    content: "My team was able to ship our MVP in record time thanks to ChadNext. Highly recommended.",
    avatar: "https://github.com/shadcn.png",
    initials: "JS",
  },
  {
    name: "Alex Johnson",
    role: "Startup Founder",
    content: "The integration with Convex and Better Auth is seamless. I can focus on building features.",
    avatar: "https://github.com/shadcn.png",
    initials: "AJ",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Loved by developers
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          See what others are saying about ChadNext.
        </p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar>
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>{testimonial.initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                <CardDescription className="text-sm">{testimonial.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
