import { MeetingsView } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { auth } from "@/lib/auth";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/modules/meetings/params";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams } : Props) => {
    const filters = await loadSearchParams(searchParams)
    
    const session = await auth.api.getSession({
            headers: await headers(),
          });
        
          if (!session) {
            redirect("/sign-in");
          }

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
          ...filters,
        })
    )

    return (
      <> 
        <MeetingsListHeader /> 
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Loading Meetings" description="This may take a few seconds" />}>
                <ErrorBoundary fallback={<ErrorState
                                                title="Error Loading Meetings"
                                                description="Something went wrong"
                                            /> }>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
      </>
    )
}

export default Page;