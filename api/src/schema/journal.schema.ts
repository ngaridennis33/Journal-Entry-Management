import { nativeEnum, object, string, TypeOf } from "zod";
import { CategoryEnumType } from "@prisma/client";

export const createJournalSchema = object({
    body: object({
        title: string({
            required_error: "Title is required",
        }),
        description: string({
            required_error: "description is required!",
        }),
        category: nativeEnum(CategoryEnumType, {
            required_error: "Category is required",
            invalid_type_error: "Category is NOT valid",
        })
    })
});

export const updateJournalSchema = object({
    params: object({
        id: string(),
    }),
    body: object({
        title: string({}).optional(),
        description: string({}).optional(),
        category: nativeEnum(CategoryEnumType, {
            invalid_type_error: "Category is NOT valid",
        }).optional(),
    })
});

export const categorySchema = object({
    params: object({
        category: nativeEnum(CategoryEnumType, {
            invalid_type_error: "Category is NOT valid",
        })
    })
})

export const deleteJournalSchema = object({
    params: object({
        id: string(),
    })
})

export type JournalInput = TypeOf<typeof createJournalSchema >['body'];
export type UpdateJournalInput = TypeOf<typeof updateJournalSchema >;
export type CategoryJournalInput = TypeOf<typeof categorySchema>["params"];
export type DeleteJournalInput = TypeOf<typeof deleteJournalSchema>['params'];