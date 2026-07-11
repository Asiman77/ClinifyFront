"use client";

import { useState } from "react";

import {
    useDepartments,
    useDoctors,
} from "@/features/catalog/api";

const PAGE_SIZE = 10;

export default function DoctorsPage() {
    const [departmentId, setDepartmentId] = useState<number | undefined>();
    const [page, setPage] = useState(0);

    const {
        data: departments,
        error: departmentsError,
        isLoading: departmentsLoading,
    } = useDepartments();

    const {
        data: doctors,
        error: doctorsError,
        isLoading: doctorsLoading,
    } = useDoctors({
        departmentId,
        page,
        size: PAGE_SIZE,
        sort: "id,asc",
    });

    function handleDepartmentChange(value: string) {
        setDepartmentId(value ? Number(value) : undefined);
        setPage(0);
    }

    return (
        <main>
            <header>
                <h1>Doctors</h1>
                <p>Find a doctor by department.</p>
            </header>

            <section aria-labelledby="doctor-filters-title">
                <h2 id="doctor-filters-title">Filters</h2>

                <label htmlFor="department">Department</label>

                <select
                    id="department"
                    value={departmentId ?? ""}
                    disabled={departmentsLoading}
                    onChange={(event) =>
                        handleDepartmentChange(event.target.value)
                    }
                >
                    <option value="">All departments</option>

                    {departments
                        ?.filter((department) => department.active)
                        .map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                </select>

                {departmentsLoading && (
                    <p role="status">Loading departments...</p>
                )}

                {departmentsError && (
                    <p role="alert">
                        {departmentsError.message}
                    </p>
                )}
            </section>

            <section aria-labelledby="doctors-list-title">
                <h2 id="doctors-list-title">Doctor list</h2>

                {doctorsLoading && (
                    <p role="status">Loading doctors...</p>
                )}

                {doctorsError && (
                    <p role="alert">{doctorsError.message}</p>
                )}

                {doctors && doctors.content.length === 0 && (
                    <p>No doctors found.</p>
                )}

                {doctors?.content.map((doctor) => (
                    <article key={doctor.id}>
                        <h3>
                            Dr. {doctor.doctorFirstName}{" "}
                            {doctor.doctorLastName}
                        </h3>

                        <p>Department: {doctor.departmentName}</p>
                        <p>Specialization: {doctor.specialization}</p>
                        <p>
                            Experience: {doctor.experienceYears ?? 0} years
                        </p>

                        {doctor.bio && <p>{doctor.bio}</p>}
                    </article>
                ))}
            </section>

            {doctors && doctors.totalPages > 1 && (
                <nav aria-label="Doctors pagination">
                    <button
                        type="button"
                        disabled={doctors.first || doctorsLoading}
                        onClick={() =>
                            setPage((currentPage) =>
                                Math.max(0, currentPage - 1),
                            )
                        }
                    >
                        Previous
                    </button>

                    <span>
                        Page {doctors.number + 1} of {doctors.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={doctors.last || doctorsLoading}
                        onClick={() =>
                            setPage((currentPage) => currentPage + 1)
                        }
                    >
                        Next
                    </button>
                </nav>
            )}
        </main>
    );
}