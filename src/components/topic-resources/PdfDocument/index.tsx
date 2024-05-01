import { AttachmentResponse, Status } from "@/types";
import PdfDocument from "../../common/PdfDocument";
import { useEffect, useState } from "react";

type Props = {
  fileId: number;
  pageStart: number;
  pageEnd: number;
  documentWidth: number;
  onLoadSuccess(): void;
};

const cache: Record<number, AttachmentResponse> = {};

export default function Component({
  props: { fileId, pageStart, pageEnd, documentWidth, onLoadSuccess },
}: {
  props: Props;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [metadata, setMetadata] = useState<AttachmentResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cachedMetadata = cache[fileId];
    if (cachedMetadata) {
      setMetadata(cachedMetadata);
      setStatus("success");
      return;
    }

    let on = true;
    setStatus("pending");
    fetch(`${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/media/${fileId}`)
      .then((response) => response.json())
      .then((data: AttachmentResponse) => {
        if (on) {
          setStatus("success");
          setMetadata(data);
        }
        cache[fileId] = data;
      })
      .catch((error) => {
        if (on) {
          setStatus("error");
          setError(error);
        }
      });

    return () => {
      on = false;
    };
  }, [fileId]);

  return (
    <>
      {status === "error" && `Error loading document ${JSON.stringify(error)}`}
      {status === "pending" && "Loading document"}
      {status === "success" && metadata && (
        <PdfDocument
          props={{
            onLoadSuccess,
            width: documentWidth,
            url: metadata.source_url,
            pageStart,
            pageEnd,
          }}
        />
      )}
    </>
  );
}
