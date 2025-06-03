import { formatId, capitalizeFirstLetter } from "@/utils";

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
      <h1 className="font-bold">{capitalizeFirstLetter(name)}</h1>
    </header>
  );
}
