import { useMemo } from "react";
import { pdfjs, Page, Document } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const arrayRange = (start: number, stop: number, step: number = 1): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

type Props = {
  width: number;
  pageStart: number;
  pageEnd: number;
  url: string;
};

export default function Component({ url, pageEnd, pageStart, width }: Props) {
  const pages = useMemo(
    () => arrayRange(+pageStart, +pageEnd).map((number) => number), // TODO: Need to adjust type to reality
    [pageEnd, pageStart]
  );

  return (
    <Document file={url}>
      {pages.map((number) => {
        return (
          <Page
            key={number}
            pageNumber={number}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        );
      })}
    </Document>
  );
}
