import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    className?: string;
    isSearchable?: boolean;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    className,
    isSearchable = true,
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    return (
        <>
            <Button
                onClickCapture={() => setOpen(true)}
                type="button"
                variant="outline"
                className={cn(
                    "h-9 justify-between font-normal px-2 w-full",
                    !selectedOption && "text-muted-foreground",
                    className
                )}
                onClick={() => setOpen(true)}
            >
                <div>{selectedOption?.children ?? placeholder}</div>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            </Button>

            <CommandResponsiveDialog shouldFilter={!onSearch} open={open} onOpenChange={setOpen}>
                {isSearchable && (
                    <CommandInput
                        placeholder="Search..."
                        onValueChange={onSearch}
                    />
                )}
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">
                        No option found
                    </span>
                </CommandEmpty>
                <CommandList>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    );
};
