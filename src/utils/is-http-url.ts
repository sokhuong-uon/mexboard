import { z } from "zod/mini";

export const isHttpUrl = (url: string) => z.httpUrl().safeParse(url).success
