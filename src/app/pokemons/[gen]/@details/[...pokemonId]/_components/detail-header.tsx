import { formatId, formatName } from "@/lib/utils";

export default function DetailHeader({
  id,
  name
}: {
  id: number;
  name: string
}) {
  return (
    <header className="text-2xl flex justify-between gap-2">
      <h1 className="text-muted-foreground">{formatId(id)}</h1>
      <h1
        className="font-bold"
        dangerouslySetInnerHTML={{ __html: formatName(name)}}
      ></h1>
    </header>
  );
}
