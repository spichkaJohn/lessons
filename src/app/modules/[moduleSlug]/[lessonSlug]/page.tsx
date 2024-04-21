import { ModuleResponse } from "@/types";
import slugify from "slugify";
import Lessons from "@/components/pages/Lessons";

type Params = { moduleSlug: string; lessonSlug: string };

export async function generateStaticParams() {
  const modulesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/module`
  );
  const modules: ModuleResponse = await modulesResponse.json();

  const params: Params[] = [];

  modules.forEach((module) =>
    module.lessons.forEach((lesson) => {
      params.push({
        moduleSlug: slugify(module.title.rendered),
        lessonSlug: slugify(lesson.title),
      });
    })
  );

  return params;
}

export default function Page({
  params: { moduleSlug, lessonSlug },
}: {
  params: Params;
}) {
  return <Lessons params={{ moduleSlug, lessonSlug }} />;
}
