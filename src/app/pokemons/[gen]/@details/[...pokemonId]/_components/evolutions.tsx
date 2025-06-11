import { getPokemonImageUrl } from "@/lib/utils";
import { Evolution } from "../../../actions";
import Image from "next/image";

export default function Evolutions({ evolutions }: { evolutions: Evolution[] }) {
  return (
    <ul className="flex">
      {evolutions.map((evolution) => {
        const imageUrl = getPokemonImageUrl(evolution.id);
        return (
          <li key={evolution.id}>
            <Image
              src={imageUrl}
              width={80}
              height={80}
              className="object-cover group-hover:scale-150 transition-transform duration-300"
              alt={`An image of ${evolution.name}`}
            />
            {evolution.name}
          </li>
        )
      })}
    </ul>
  );
}