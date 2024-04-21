import { ModuleResponse } from "@/types";
import slugify from "slugify";
import LessonsPage from "@/components/LessonPage";

type Params = { moduleSlug: string; lessonSlug: string };

export async function generateStaticParams() {
  const modulesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/lesson`
  );
  const modules: ModuleResponse = await modulesResponse.json();

  const params: Params[] = [];

  modules.forEach((module) =>
    module.lessons.forEach((lesson) => {
      params.push({
        moduleSlug: slugify(module.title.rendered),
        lessonSlug: slugify(lesson.lessons_title),
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
  return <LessonsPage params={{ moduleSlug, lessonSlug }} />;
}
