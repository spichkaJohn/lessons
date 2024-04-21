"use client";

import { ModuleResponse } from "@/types";
import { useState, useEffect, useMemo } from "react";
import slugify from "slugify";
import LessonCard from "../LessonCard";

export default function ModulesPage({
  params: { moduleSlug },
}: {
  params: { moduleSlug: string };
}) {
  const [modules, setModules] = useState<ModuleResponse>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/lesson`)
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
      });
  }, [setModules]);

  const activeModule = useMemo<ModuleResponse[number] | undefined>(() => {
    return modules?.find(
      (module) => moduleSlug === slugify(module.title.rendered)
    );
  }, [modules, moduleSlug]);

  return (
    <main>
      <div className="container">
        <div className="row">
          <h1 className="mt-4">Занятия</h1>
          {activeModule?.lessons.map((lesson, index) => (
            <div key={index} className="col-md-4">
              <LessonCard
                title={lesson.lessons_title}
                moduleTitle={activeModule.title.rendered}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
