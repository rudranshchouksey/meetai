import Link from "next/link";
import { ChevronRightIcon, TrashIcon, PencilIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


interface Props {
    agentid: string;
    agentName: string;
    onEdit: () => void;
    onRemove: () => void;
}

export const AgentIdViewHeader = ({ 
    agentid, 
    agentName, 
    onEdit, 
    onRemove 
}: Props) => { 
   return (
    <div className="flex items-center justify-between">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild className="font-medium text-xl">
                        <Link href="/agents">
                            My Agents
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-foreground text-xl font-medium [&svg]:size-4">
                    <ChevronRightIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
                        <Link href={`/agents/${agentid}`}>
                            {agentName}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        {/* Without modal = {false}, the dialog that this dropdown opens cause the website to get unclickable*/}
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                    <MoreHorizontalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                    <PencilIcon className="text-black size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRemove}>
                    <TrashIcon className="text-black size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
   ) 
}