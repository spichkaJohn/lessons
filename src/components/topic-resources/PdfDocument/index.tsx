import { AttachmentResponse, Status } from "@/types";
import PdfDocument from "../../common/PdfDocument";
import { useCallback, useEffect, useState } from "react";

import { PageChangeEventArgs } from "@syncfusion/ej2-react-pdfviewer";

type Props = {
  fileId: number;
  pageStart: number;
  pageEnd: number;
  scrollKey?: string;
};

const cache: Record<number, AttachmentResponse> = {};

export default function Component({
  props: { fileId, pageStart, pageEnd, scrollKey },
}: {
  props: Props;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [metadata, setMetadata] = useState<AttachmentResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initialPage, setInitialPage] = useState<number | undefined>();

  useEffect(() => {
    if (status !== "success" || !scrollKey) {
      return;
    }

    const savedInitialPage = localStorage.getItem(scrollKey);

    if (!savedInitialPage) {
      return;
    }

    setInitialPage(Number(savedInitialPage));
  }, [status, scrollKey]);

  const onPageChange = useCallback(
    (e: PageChangeEventArgs) => {
      scrollKey && localStorage.setItem(scrollKey, String(e.currentPageNumber));
    },
    [scrollKey]
  );

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
            onPageChange,
            url: metadata.source_url,
            pageStart: initialPage ?? pageStart,
            pageEnd,
          }}
        />
      )}
    </>
  );
}
