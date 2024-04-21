import slugify from "slugify";

type PropsT = { moduleTitle: string; title: string };

export default function Component({ moduleTitle, title }: PropsT) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text"></p>
        <a
          href={`/modules/${slugify(moduleTitle)}/${slugify(title)}`}
          className="btn btn-primary"
        >
          Открыть
        </a>
      </div>
    </div>
  );
}
