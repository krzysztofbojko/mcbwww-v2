import { defaultLocale, getDictionary, localePath } from "@/i18n";

export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);
  return (
    <main>
      <h1>{dict.notFound.title}</h1>
      <p>{dict.notFound.body}</p>
      <a href={localePath(defaultLocale, "/")}>{dict.notFound.back}</a>
    </main>
  );
}
