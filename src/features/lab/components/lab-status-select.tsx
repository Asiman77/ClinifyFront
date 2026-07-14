"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { LabStatus } from "@/types/lab";
type EditableLabStatus = Exclude<
    LabStatus,
    "NOT_REQUIRED" | "REQUESTED"
>;

function isEditableLabStatus(
    status: LabStatus,
): status is EditableLabStatus {
    return (
        status !== "NOT_REQUIRED" &&
        status !== "REQUESTED"
    );
}

const STATUS_LABELS: Record<EditableLabStatus, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const AVAILABLE_STATUSES: Record<
    EditableLabStatus,
    EditableLabStatus[]
> = {
    PENDING: ["PENDING", "IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
    COMPLETED: ["COMPLETED"],
    CANCELLED: ["CANCELLED"],
};

type LabStatusSelectProps = {
    currentStatus: LabStatus;
    value: LabStatus;
    disabled?: boolean;
    onValueChange: (status: LabStatus) => void;
};

export function LabStatusSelect({
    currentStatus,
    value,
    disabled = false,
    onValueChange,
}: LabStatusSelectProps) {
    if (
        !isEditableLabStatus(currentStatus) ||
        !isEditableLabStatus(value)
    ) {
        return null;
    }
    const availableStatuses = AVAILABLE_STATUSES[currentStatus];

    const items = Object.fromEntries(
        availableStatuses.map((status) => [
            status,
            STATUS_LABELS[status],
        ]),
    );

    return (
        <Field>
            <FieldLabel htmlFor="lab-status">
                Status
            </FieldLabel>

            <Select
                items={items}
                value={value}
                disabled={disabled}
                onValueChange={(nextValue) => {
                    if (nextValue) {
                        onValueChange(nextValue as LabStatus);
                    }
                }}
            >
                <SelectTrigger
                    id="lab-status"
                    className="w-full sm:w-64"
                >
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {availableStatuses.map((status) => (
                            <SelectItem
                                key={status}
                                value={status}
                            >
                                {STATUS_LABELS[status]}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    );
}