import { ModuleLessonTopicResource } from "@/types";
import PdfDocument from "../PdfDocument";
import RichText from "../../common/RichText";

type Props = {
  resource: ModuleLessonTopicResource;
  documentWidth: number;
  onLoadSuccess(): void;
};

export default function Component({
  resource: {
    document,
    document_page_start: pageStart,
    document_page_end: pageEnd,
    text,
    type,
  },
  documentWidth,
  onLoadSuccess,
}: Props) {
  switch (type) {
    case "document":
      return (
        <PdfDocument
          props={{
            onLoadSuccess,
            documentWidth,
            fileId: document,
            pageStart,
            pageEnd,
          }}
        />
      );

    case "text":
      return <RichText props={{ onLoadSuccess, data: text }} />;
    default:
      return;
  }
}
