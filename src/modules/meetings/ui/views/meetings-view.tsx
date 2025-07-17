"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { DataTable } from "@/components/data-table"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/empty-state"
import { useRouter } from "next/navigation"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { DataPagination } from "@/components/data-pagination"

export const MeetingsView = () => {
    const trpc = useTRPC()
    const router = useRouter()
    const [filters, setFilters] = useMeetingsFilters()

    const { data, isLoading, isError } = useQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }))

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
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns} onRowClick={(row) => router.push(`/meetings/${row.id}`)} />
            <DataPagination 
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({  })}
            />
            {data.items.length === 0 && (
                            <EmptyState 
                                title="Create your first meetings"
                                description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
            
                            />
                        )}
        
        </div>
    )
}