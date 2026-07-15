"use client";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { DoctorProfile } from "@/types/doctor";

type AvailabilityFilterProps = {
    doctors: DoctorProfile[];
};

export function AvailabilityFilter({
    doctors,
}: AvailabilityFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentDoctor =
        searchParams.get("doctor") ?? "all";

    const doctorItems = {
        all: "All doctors",
        ...Object.fromEntries(
            doctors.map((doctor) => [
                String(doctor.id),
                getDoctorName(doctor),
            ]),
        ),
    };

    return (
        <Select
            items={doctorItems}
            value={currentDoctor}
            onValueChange={(value) => {
                const nextParams = new URLSearchParams(
                    searchParams.toString(),
                );

                if (!value || value === "all") {
                    nextParams.delete("doctor");
                } else {
                    nextParams.set(
                        "doctor",
                        String(value),
                    );
                }

                const query = nextParams.toString();

                router.replace(
                    query
                        ? `/admin/availabilities?${query}`
                        : "/admin/availabilities",
                    {
                        scroll: false,
                    },
                );
            }}
        >
            <SelectTrigger
                className="w-56"
                aria-label="Filter by doctor"
            >
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectItem value="all">
                        All doctors
                    </SelectItem>

                    {doctors.map((doctor) => (
                        <SelectItem
                            key={doctor.id}
                            value={String(doctor.id)}
                        >
                            {getDoctorName(doctor)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function getDoctorName(
    doctor: DoctorProfile,
): string {
    return `${doctor.doctorFirstName} ${doctor.doctorLastName}`.trim();
}