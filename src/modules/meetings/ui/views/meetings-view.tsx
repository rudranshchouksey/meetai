"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export const MeetingsView = () => {
    const trpc = useTRPC()
    const { data, isLoading, isError } = useQuery(trpc.meetings.getMany.queryOptions({}))

    if(isLoading) {
            return (
            <LoadingState 
                title="Loading Meetings"
                description="This may take a few seconds..."
            />
            )
        }
    
        if(isError) {
            return (
            <ErrorState 
                title="Error Loading Meetings"
                description="Please try again later"
            />
            )
        }

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}