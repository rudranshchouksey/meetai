import { ResponsiveDialog } from "@/components/responsive-dialog";

import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface NewMeetingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialValue: MeetingGetOne
}

export const UpdateMeetingDialog = ({
    open,
    onOpenChange,
    initialValue,
}: NewMeetingDialogProps) => {

    return (
        <ResponsiveDialog
            title="Edit Meeting"
            description="Edit the meeting details"
            open={open}
            onOpenChange= {onOpenChange}
        >
            <MeetingForm 
                onSuccess={() => { onOpenChange(false) }}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValue}
            />
        </ResponsiveDialog>
    )
}