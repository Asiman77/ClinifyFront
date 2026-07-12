"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { AvailableSlot } from "@/types/slot";

type BookingConfirmationProps = {
    date: string;
    slot: AvailableSlot;
    reason: string;
    isSubmitting: boolean;
    errorMessage?: string;
    onReasonChange: (reason: string) => void;
    onConfirm: () => void;
};

export function BookingConfirmation({
    date,
    slot,
    reason,
    isSubmitting,
    errorMessage,
    onReasonChange,
    onConfirm,
}: BookingConfirmationProps) {
    const startTime = formatSlotTime(slot.startTime);
    const endTime = formatSlotTime(slot.endTime);

    return (
        <section
            aria-labelledby="booking-confirmation-title"
            className="flex flex-col gap-4 border-t pt-4"
        >
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3
                        id="booking-confirmation-title"
                        className="text-sm font-medium"
                    >
                        Confirm appointment
                    </h3>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                        {formatDisplayDate(date)} /{" "}
                        <span className="tabular-nums">
                            {startTime} - {endTime}
                        </span>
                    </p>
                </div>

                <Badge variant="secondary">Online</Badge>
            </header>

            <Field>
                <FieldLabel htmlFor="appointment-reason">
                    Reason
                </FieldLabel>

                <Textarea
                    id="appointment-reason"
                    value={reason}
                    maxLength={1000}
                    disabled={isSubmitting}
                    placeholder="Add a short reason for your visit"
                    className="min-h-20 resize-y"
                    onChange={(event) =>
                        onReasonChange(event.target.value)
                    }
                />

                <div className="flex justify-between gap-4">
                    <FieldDescription>Optional</FieldDescription>

                    <span className="text-xs text-muted-foreground">
                        {reason.length}/1000
                    </span>
                </div>
            </Field>

            {errorMessage && (
                <FieldError>{errorMessage}</FieldError>
            )}

            <Button
                type="button"
                disabled={isSubmitting}
                className="w-full"
                onClick={onConfirm}
            >
                {isSubmitting && (
                    <Spinner data-icon="inline-start" />
                )}

                {isSubmitting
                    ? "Booking..."
                    : `Confirm ${startTime} - ${endTime}`}
            </Button>
        </section>
    );
}

function formatSlotTime(dateTime: string): string {
    const separatorIndex = dateTime.indexOf("T");
    const time = separatorIndex >= 0 ? dateTime.slice(separatorIndex + 1) : dateTime;

    return time.slice(0, 5);
}

function formatDisplayDate(value: string): string {
    const [
        yearText = "",
        monthText = "",
        dayText = "",
    ] = value.split("-");

    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    if (!year || !month || !day) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(year, month - 1, day));
}