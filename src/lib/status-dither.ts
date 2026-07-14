import type { DitherColor } from "@/components/dither-kit";
import type { AppointmentStatus } from "@/types/appointment";
import type { LabStatus } from "@/types/lab";

type AnyStatus = AppointmentStatus | LabStatus;

export const statusDitherColor: Record<AnyStatus, DitherColor> = {
    NOT_REQUIRED: "grey",
    REQUESTED: "orange",
    APPROVED: "blue",
    COMPLETED: "green",
    REJECTED: "red",
    CANCELLED: "grey",
    NO_SHOW: "pink",
    PENDING: "orange",
    IN_PROGRESS: "blue",
};