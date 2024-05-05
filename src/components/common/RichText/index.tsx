type Props = {
  data: string;
};

export default function Component({ props: { data } }: { props: Props }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data,
      }}
    />
  );
}
