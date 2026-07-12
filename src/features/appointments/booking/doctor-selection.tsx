"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { DoctorOption } from "@/features/appointments/booking/doctor-option";
import type { Department } from "@/types/department";
import type { DoctorProfile } from "@/types/doctor";

type DoctorSelectionProps = {
    departments: Department[];
    doctors: DoctorProfile[];
    departmentId?: number;
    selectedDoctorId?: number;
    departmentsLoading: boolean;
    doctorsLoading: boolean;
    errorMessage?: string;
    onDepartmentChange: (departmentId?: number) => void;
    onDoctorSelect: (doctorId: number) => void;
};

export function DoctorSelection({
    departments,
    doctors,
    departmentId,
    selectedDoctorId,
    departmentsLoading,
    doctorsLoading,
    errorMessage,
    onDepartmentChange,
    onDoctorSelect,
}: DoctorSelectionProps) {
    const [search, setSearch] = useState("");

    const activeDepartments = departments.filter(
        (department) => department.active,
    );

    const normalizedSearch = search.trim().toLowerCase();

    const visibleDoctors = doctors.filter((doctor) => {
        if (!doctor.active) {
            return false;
        }

        if (!normalizedSearch) {
            return true;
        }

        const searchableText = [
            doctor.doctorFirstName,
            doctor.doctorLastName,
            doctor.specialization,
            doctor.departmentName,
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(normalizedSearch);
    });

    const departmentItems = {
        all: "All departments",
        ...Object.fromEntries(
            activeDepartments.map((department) => [
                String(department.id),
                department.name,
            ]),
        ),
    };

    return (
        <section
            aria-labelledby="doctor-selection-title"
            className="flex flex-col gap-4"
        >
            <h2 id="doctor-selection-title" className="text-sm font-medium">
                Choose a doctor
            </h2>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_14rem]">
                <div>
                    <Label htmlFor="doctor-search" className="sr-only">
                        Search doctors
                    </Label>
                    <Input
                        id="doctor-search"
                        type="search"
                        value={search}
                        placeholder="Search doctors"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="department-filter" className="sr-only">
                        Department
                    </Label>
                    <Select
                        items={departmentItems}
                        value={
                            departmentId === undefined
                                ? "all"
                                : String(departmentId)
                        }
                        disabled={departmentsLoading}
                        onValueChange={(value) =>
                            onDepartmentChange(
                                value === null || value === "all"
                                    ? undefined
                                    : Number(value),
                            )
                        }
                    >
                        <SelectTrigger
                            id="department-filter"
                            className="w-full"
                            aria-label="Department"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">
                                    All departments
                                </SelectItem>

                                {activeDepartments.map((department) => (
                                    <SelectItem
                                        key={department.id}
                                        value={String(department.id)}
                                    >
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {errorMessage && (
                <p role="alert" className="text-sm text-destructive">
                    {errorMessage}
                </p>
            )}

            {doctorsLoading ? (
                <div className="flex min-h-28 items-center justify-center gap-2">
                    <Spinner />
                    <p className="text-sm text-muted-foreground">
                        Loading doctors...
                    </p>
                </div>
            ) : visibleDoctors.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No doctors match your filters.
                </p>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {visibleDoctors.map((doctor) => (
                        <DoctorOption
                            key={doctor.id}
                            doctor={doctor}
                            selected={selectedDoctorId === doctor.id}
                            onSelect={() => onDoctorSelect(doctor.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}