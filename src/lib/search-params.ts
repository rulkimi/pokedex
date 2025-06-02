import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  createSerializer,
} from "nuqs/server";

const searchParams = {
  search: parseAsString.withDefault(""),
}

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
