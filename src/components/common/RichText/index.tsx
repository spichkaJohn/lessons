type Props = {
  data: string;
};

export default function Component({ data }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data,
      }}
    />
  );
}
