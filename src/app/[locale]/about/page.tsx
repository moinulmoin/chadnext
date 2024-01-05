import { allAbouts, type About } from "contentlayer/generated";
import { type Metadata } from "next";

function AboutCard(about: About) {
  return (
    <article className="prose prose-slate mb-8 dark:prose-invert">
      <h2 className="mb-0 text-3xl font-semibold tracking-tight transition-colors ">
        {about.title}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: about.body.html }} />
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
        {allAbouts.map((p, i) => (
          <AboutCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}
