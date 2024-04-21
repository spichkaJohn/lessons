"use client";

import ModuleCard from "@/components/ModulesCard";
import { ModuleResponse } from "@/types";
import { useEffect, useState } from "react";

const Page = () => {
  const [modules, setModules] = useState<ModuleResponse>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/lesson`)
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
      });
  }, [setModules]);

  return (
    <main>
      <div className="container">
        <div className="row">
          <h1 className="mt-4">Модули</h1>
          {modules?.map((module) => (
            <div key={module.id} className="col-md-4">
              <ModuleCard title={module.title.rendered} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
