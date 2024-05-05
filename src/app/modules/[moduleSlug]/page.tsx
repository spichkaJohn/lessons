import ModulePage from "@/components/pages/ModulePage";
import { MODULES_URL } from "@/constants";
import { ModulesResponse } from "@/types";
import { notFound } from "next/navigation";

type Params = { moduleSlug: string };

export default async function Page({
  params: { moduleSlug },
}: {
  params: Params;
}) {
  const modulesResponse = await fetch(`${MODULES_URL}?slug=${moduleSlug}`, {
    cache: "no-store",
  });
  const modules: ModulesResponse = await modulesResponse.json();

  const module = modules[0];

  if (!module) {
    notFound();
  }

  return <ModulePage props={{ module }} />;
}
