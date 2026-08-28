"use client";

import { TableOfContents } from "@/components/TableOfContents";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContentsWrapper({ headings }: { headings: Heading[] }) {
  return <TableOfContents headings={headings} />;
}
