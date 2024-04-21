import Modules from "@/components/pages/Modules";
import { ModuleResponse } from "@/types";
import slugify from "slugify";

type Params = { moduleSlug: string };

export async function generateStaticParams() {
  const modulesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/module`
  );
  const modules: ModuleResponse = await modulesResponse.json();

  return modules.map((module) => ({
    moduleSlug: slugify(module.title.rendered),
  }));
}
export default function Page({ params: { moduleSlug } }: { params: Params }) {
  return <Modules params={{ moduleSlug }} />;
}
