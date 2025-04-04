import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  avatar: string; // URL to avatar image
}

// Placeholder data - replace with actual testimonials
const testimonials: Testimonial[] = [
  {
    name: "Jane Doe",
    title: "CEO, Example Inc.",
    quote: "This product transformed our workflow! Highly recommended.",
    avatar: "/images/avatars/placeholder.png", // Replace with actual path
  },
  {
    name: "John Smith",
    title: "Developer, Tech Solutions",
    quote: "Incredibly easy to set up and use. Saved us countless hours.",
    avatar: "/images/avatars/placeholder.png", // Replace with actual path
  },
  {
    name: "Alice Brown",
    title: "Marketing Manager, Startup Co.",
    quote: "The perfect solution we were looking for. Excellent support too!",
    avatar: "/images/avatars/placeholder.png", // Replace with actual path
  },
];

export default function Testimonials() {
  return (
    <section className="container py-12 md:py-24">
      <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
        What Our Users Say
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-4">
                {/* Placeholder for avatar - replace with <Image> */}
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div>
                  <CardTitle>{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="italic">{`"${testimonial.quote}"`}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
