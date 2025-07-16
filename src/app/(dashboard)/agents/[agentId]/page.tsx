import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { AgentIdView } from "@/modules/agents/ui/views/agent-id-view";
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

interface Props {
    params: Promise<{ agentId: string }>;
}

const Page = async ({params} : Props) => {
    const { agentId } = await params;

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({ id: agentId })
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Loading Agent" description="This may take a few seconds" />}>
                <ErrorBoundary fallback={<ErrorState
                                                title="Error Loading Agents"
                                                description="Something went wrong"
                                            />}>
                    <AgentIdView agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;