import { getDictionary } from "@/i18n";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

/** notFound() inside a locale route; unmatched URLs are served by app/global-not-found.tsx with the same body. */
export default async function NotFound() {
  const [pl, en] = await Promise.all([getDictionary("pl"), getDictionary("en")]);
  return <NotFoundContent pl={pl} en={en} />;
}
