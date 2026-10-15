import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <main>
      <h1>{dict.site.name}</h1>
    </main>
  );
}
