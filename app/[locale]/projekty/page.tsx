import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/i18n";
import { projectsByStatus } from "@/lib/publications";
import { Heading, Section } from "@/components/ui";
import { ProjectList } from "@/components/sections/ProjectList";
import { ProjectTabs } from "@/components/sections/ProjectTabs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({ locale, path: "/projekty", title: dict.projects.title, description: dict.projects.metaDescription });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const d = dict.projects;
  const groups = projectsByStatus(projects);
  const running = groups.w_trakcie.length;
  const completed = groups.zrealizowane.length;
  const lede = d.lede
    .replace("{running}", d.runningCount.replace("{n}", String(running)))
    .replace("{completed}", d.completedCount.replace("{n}", String(completed)));

  return (
    <main id="main">
      <Section tone="paper" space="loose" aria-labelledby="projects-title" className="md:pt-20">
        <div className="grid-12 gap-y-5">
          <Heading as="h1" size="l" id="projects-title" className="col-span-12 md:col-span-7">
            {d.title}
          </Heading>
          <div className="col-span-12 max-w-[30em] text-body text-ink-muted md:col-span-5 md:col-start-8 md:pt-3 lg:col-span-4 lg:col-start-9">
            <p className="m-0">{lede}</p>
            {d.contentNote ? <p className="mt-3 mb-0 text-small">{d.contentNote}</p> : null}
          </div>
        </div>
        <div className="mt-12 md:mt-16">
          <ProjectTabs
            label={d.statusLabel}
            tabs={[
              {
                id: "w-trakcie",
                label: d.running,
                count: running,
                content: <ProjectList items={groups.w_trakcie} locale={locale} dict={dict} />,
              },
              {
                id: "zrealizowane",
                label: d.completed,
                count: completed,
                content: <ProjectList items={groups.zrealizowane} locale={locale} dict={dict} />,
              },
            ]}
          />
        </div>
      </Section>
    </main>
  );
}
