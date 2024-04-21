import { ModuleLessonTopicResource } from "@/types";
import PdfDocument from "../PdfDocument";
import RichText from "../../common/RichText";

type Props = {
  resource: ModuleLessonTopicResource;
  documentWidth: number;
};

export default function Component({ resource, documentWidth }: Props) {
  return (
    <>
      {resource.text && <RichText data={resource.text} />}

      {resource.document && (
        <PdfDocument
          fileId={resource.document}
          pageStart={resource.document_page_start}
          pageEnd={resource.document_page_end}
          documentWidth={documentWidth}
        />
      )}
    </>
  );
}
