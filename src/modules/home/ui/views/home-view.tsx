"use client";

import { useTRPC } from "@/trcp/client";
import { useQuery } from "@tanstack/react-query";

export default function HomeView() {
  const trcp = useTRPC()
  const { data } = useQuery(trcp.hello.queryOptions({ text: "Rudransh" }))

  return (
    <div className="p-4 flex flex-col gap-y-10">
      {data?.greeting}
    </div>
  );
}
