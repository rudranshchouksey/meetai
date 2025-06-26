import { LoadingState } from "@/components/loading-state"
import { AgentsViews } from "@/modules/agents/ui/views/agents-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { ErrorState } from "@/components/error-state"

const Page = async () => {
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <Suspense fallback={<LoadingState title="Loading Agents" description="This may take a few seconds" />}>
                <ErrorBoundary fallback={<ErrorState
                            title="Error Loading Agents"
                            description="Something went wrong"
                        /> }>
                    <AgentsViews />
                </ErrorBoundary>    
            </Suspense>    
        </HydrationBoundary>
    )
}

export default Page