"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

import { DataTable } from "@/modules/agents/ui/components/data-table"
import { columns} from "@/modules/agents/ui/components/columns"
import { EmptyState } from "@/components/empty-state"


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
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable columns={columns} data={data} />
            {data.length === 0 && (
                <EmptyState 
                    title="Create your first agent"
                    description="Create an agent to join your meetings, Each agent will follow your instructions and can intreact with praticipants during the call."

                />
            )} 
        </div>
    )
}