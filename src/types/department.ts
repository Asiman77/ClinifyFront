export type Department = {
    id: number;
    name: string;
    description: string | null;
    active: boolean;
};

export type DepartmentRequest = {
    name: string;
    description: string | null;
    active: boolean;
};