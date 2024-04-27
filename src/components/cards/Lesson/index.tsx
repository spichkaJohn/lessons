import { ModuleLesson, Module } from "@/types";
import slugify from "slugify";

type Props = { lesson: ModuleLesson; module: Module; lessonIndex: number };

export default function Component({
  lesson: { title },
  lessonIndex,
  module: { slug },
}: Props) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text"></p>
        <a href={`/modules/${slug}/${lessonIndex}`} className="btn btn-primary">
          Открыть
        </a>
      </div>
    </div>
  );
}
