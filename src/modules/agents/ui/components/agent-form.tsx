import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { agentsInsertSchema } from "../../schemas";
import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues
}: AgentFormProps) => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                )
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions(),
                )

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({id: initialValues.id})
                    )
                }
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)

                if (error.data?.code === "FORBIDDEN") {
                    router.push("/upgrade")
                }
            },
        })
    )

    const UpdateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                )

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({id: initialValues.id})
                    )
                }
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            },
        })
    )

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ??"",
            instructions: initialValues?.instructions ??"",
        },
    })

    const isEdit = !!initialValues?.id
    const isPending = createAgent.isPending || UpdateAgent.isPending

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            UpdateAgent.mutate({...values, id: initialValues?.id})
        } else {
            createAgent.mutate(values)
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar 
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Rudra" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="You are a helpful math assistant that can answer questions and help with tasks" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                       <Button
                            variant={"ghost"}
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}
                       >
                            Cancel
                       </Button> 
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}