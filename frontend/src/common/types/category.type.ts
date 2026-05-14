export type Category = {
    id: string;
    name: string;
    url?: string | null;
    parentId?: string | null;
    children?: Category[];
};