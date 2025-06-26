"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"

export const AgentsViews = () => {
    const trcp = useTRPC()
    const { data, isLoading, isError } = useSuspenseQuery(trcp.agents.getMany.queryOptions())

    console.log(data)

    if(isLoading) {
        return (
        <LoadingState 
            title="Loading Agents"
            description="This may take a few secinds..."
        />
        )
    }

    if(isError) {
        return (
        <ErrorState 
            title="Error Loading Agents"
            description="Please try again later"
        />
        )
    }

    return (
        <div>
            <ResponsiveDialog 
                title="Responsive text"
                description="Responsive description"
                open
                onOpenChange={() => {}}
            />
             <Button>
                Some Action
             </Button>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}