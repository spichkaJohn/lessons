import { Module } from "@/types";
import Lesson from "../../cards/Lesson";

type Props = { module: Module };

export default function Page({ props: { module } }: { props: Props }) {
  return (
    <main>
      <div className="container">
        <div className="row">
          <h1 className="mt-4">Занятия</h1>
          {module.lessons?.map((lesson, index) => (
            <div key={index} className="col-md-4">
              <Lesson lessonIndex={index} module={module} lesson={lesson} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
