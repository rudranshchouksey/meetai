import { auth } from "@/lib/auth";
import { MeetingIdView } from "@/modules/meetings/ui/views/meeting-id-views";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

interface Props {
    params: Promise<{
        meetingId: string;
    }>;
}

const Page = async ({ params }: Props) => {
    const { meetingId } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect("/sign-in")
    }

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    )

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<LoadingState title="Loading Meetings" description="This may take a few seconds" />}>
                    <ErrorBoundary fallback={<ErrorState
                                                title="Error Loading Meetings"
                                                description="Something went wrong"
                                            /> }>
                        <MeetingIdView meetingId={meetingId} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>

    )
}

export default Page;