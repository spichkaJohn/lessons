import Module from "@/components/cards/Module";
import { MODULES_URL } from "@/constants";
import { ModulesResponse } from "@/types";

const Page = async () => {
  const modulesResponse = await fetch(MODULES_URL, { cache: "no-store" });
  const modules: ModulesResponse = await modulesResponse.json();

  return (
    <main>
      <div className="container">
        <div className="row">
          <h1 className="mt-4">Модули</h1>
          {modules?.map((module) => (
            <div key={module.id} className="col-md-4">
              <Module props={{ module }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
