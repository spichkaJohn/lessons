import { useEffect } from "react";

type Props = {
  data: string;
  onLoadSuccess(): void;
};

export default function Component({
  props: { data, onLoadSuccess },
}: {
  props: Props;
}) {
  useEffect(() => {
    onLoadSuccess();
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data,
      }}
    />
  );
}
