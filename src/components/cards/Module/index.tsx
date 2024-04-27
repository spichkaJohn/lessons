import { Module } from "@/types";
import slugify from "slugify";

type Props = { module: Module };

export default function Component({
  props: {
    module: {
      title: { rendered },
      slug,
    },
  },
}: {
  props: Props;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{rendered}</h5>
        <p className="card-text"></p>
        <a href={`/modules/${slug}`} className="btn btn-primary">
          Открыть
        </a>
      </div>
    </div>
  );
}
