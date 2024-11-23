import { abouts, type About } from "content";
import { type Metadata } from "next";

function AboutCard(about: About) {
  return (
    <article className="prose prose-slate mb-8 dark:prose-invert">
      <h2 className="mb-0 text-3xl font-semibold tracking-tight transition-colors">
        {about.title}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: about.content }} />
    </article>
  );
}

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the tech stack and inspiration behind ChadNext.",
};

export default function About() {
  return (
    <div className="container min-h-screen py-8">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">About</h1>
      <p className="mb-10 mt-2.5 text-xl text-muted-foreground">
        Learn about the tech stack and inspiration behind ChadNext.
      </p>
      <div className="space-y-10">
        {abouts.map((p, i) => (
          <AboutCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}
