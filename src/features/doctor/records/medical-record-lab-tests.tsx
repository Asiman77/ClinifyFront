"use client";

import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { MedicalRecordFormValues } from "@/features/doctor/records/schemas";

export function MedicalRecordLabTests({
    form,
}: {
    form: UseFormReturn<MedicalRecordFormValues>;
}) {
    const labTests = useFieldArray({
        control: form.control,
        name: "labTests",
    });

    return (
        <Field>
            <div className="flex items-center justify-between gap-3">
                <FieldLabel>Laboratory requests</FieldLabel>
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() =>
                        labTests.append({
                            testName: "",
                            note: "",
                        })
                    }
                >
                    <HugeiconsIcon
                        icon={Add01Icon}
                        data-icon="inline-start"
                    />
                    Add test
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {labTests.fields.map((test, index) => (
                    <div
                        key={test.id}
                        className="grid gap-2 border-t pt-3 sm:grid-cols-[1fr_1fr_auto]"
                    >
                        <Input
                            aria-label="Test name"
                            placeholder="Test name"
                            {...form.register(
                                `labTests.${index}.testName`,
                            )}
                        />
                        <Input
                            aria-label="Test note"
                            placeholder="Optional note"
                            {...form.register(`labTests.${index}.note`)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Remove test"
                            title="Remove test"
                            onClick={() => labTests.remove(index)}
                        >
                            <HugeiconsIcon icon={Delete02Icon} />
                        </Button>
                        <FieldError
                            className="sm:col-span-3"
                            errors={
                                form.formState.errors.labTests?.[index]
                                    ?.testName
                                    ? [
                                          form.formState.errors.labTests[
                                              index
                                          ]!.testName!,
                                      ]
                                    : undefined
                            }
                        />
                    </div>
                ))}
            </div>
        </Field>
    );
}
