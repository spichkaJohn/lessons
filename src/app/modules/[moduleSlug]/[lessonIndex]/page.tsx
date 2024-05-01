import { ModulesResponse } from "@/types";
import LessonPage from "@/components/pages/LessonPage";
import { MODULES_URL } from "@/constants";
import { notFound } from "next/navigation";

type Params = { moduleSlug: string; lessonIndex: number };

export default async function Page({
  params: { moduleSlug, lessonIndex },
}: {
  params: Params;
}) {
  const modulesResponse = await fetch(`${MODULES_URL}?slug=${moduleSlug}`);
  const modules: ModulesResponse = await modulesResponse.json();

  const module = modules[0];

  const lesson = module?.lessons?.[lessonIndex];

  if (!lesson) {
    notFound();
  }
  return <LessonPage props={{ module, lesson, lessonIndex }} />;
}
