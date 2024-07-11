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
            invalid_type_error: "Category must be a valid enum value",
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
            invalid_type_error: "Category must be a valid enum value",
        }).optional(),
    })
});

export const deleteJournalSchema = object({
    params: object({
        id: string(),
    })
})

export type JournalInput = TypeOf<typeof createJournalSchema >['body'];
export type UpdateJournalInput = TypeOf<typeof updateJournalSchema >;
export type DeleteJournalInput = TypeOf<typeof deleteJournalSchema>['params'];