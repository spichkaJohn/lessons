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
  onLoadSuccess?: () => void;
};

export default function Component({
  props: { url, pageEnd, pageStart, width, onLoadSuccess },
}: {
  props: Props;
}) {
  const pages = useMemo(
    () => arrayRange(+pageStart, +pageEnd).map((number) => number), // TODO: Need to adjust type to reality
    [pageEnd, pageStart]
  );

  return (
    <Document file={url} onLoadSuccess={onLoadSuccess}>
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
