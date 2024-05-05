import { useCallback, useEffect, useRef } from "react";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  TextSearch,
  Inject,
  PageChangeEventArgs,
} from "@syncfusion/ej2-react-pdfviewer";

const arrayRange = (start: number, stop: number, step: number = 1): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

type Props = {
  pageStart: number;
  pageEnd: number;
  url: string;
  onPageChange?: (e: PageChangeEventArgs) => void;
};

export default function Component({
  props: { url, pageEnd, pageStart, onPageChange },
}: {
  props: Props;
}) {
  const pdfViewerRef = useRef<PdfViewerComponent>(null);

  const goToPage = useCallback((pageStart: number) => {
    pdfViewerRef.current?.navigationModule.goToPage(pageStart);
  }, []);

  useEffect(() => {
    goToPage(pageStart);
  }, [pageStart]);

  return (
    <PdfViewerComponent
      ref={pdfViewerRef}
      documentPath={url}
      resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
      documentLoad={() => goToPage(pageStart)}
      pageChange={onPageChange}
      toolbarSettings={{
        showTooltip: false,
        toolbarItems: [
          "UndoRedoTool",
          "PageNavigationTool",
          "MagnificationTool",
          "SelectionTool",
          "SearchOption",
        ],
      }}
      enableNavigation={true}
      style={{ height: "100vh" }}
      enableThumbnail={false}
    >
      <Inject services={[Toolbar, Navigation, Magnification, TextSearch]} />
    </PdfViewerComponent>
  );
}
