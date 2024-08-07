import { Journal, Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
// Create a new Journal

export const createJournalService = async (input: Prisma.JournalCreateInput) => {
    return ( await prisma.journal.create({
        data: input,
    })) as Journal;
}




// Get All Journals

export const getAllJournalsService = async(
    userId: string
) => {
    return (await prisma.journal.findMany({
        where: {
            userId,
        }
    }));
}


// Get Specific journal

export const findJournalService = async(
    where: Prisma.JournalWhereUniqueInput & { userId?: string },
    select?: Prisma.JournalSelect
) => {

    const {id, userId, ...rest} = where;

    //  Query:
    const query: Prisma.JournalWhereUniqueInput = {
        id,
        ...(userId && { userId}),
        ...rest
    };
    return ( await prisma.journal.findUnique({
        where: query,
        select,
    })) as Journal;
}


// Get Journal By Category

export const findJournalByCategoryService = async(
    where: Prisma.JournalWhereInput & {userId?: string},
    select?: Prisma.JournalSelect
) => {
    const {id, userId, ...rest} = where;

    return ( await prisma.journal.findMany({
        where:{
            ...rest,
            userId
        },
        select,
    })) as Journal[];
}



// Update Journal

export const updateJournalService = async (
    where: Prisma.JournalWhereUniqueInput,
    data: Prisma.JournalUpdateInput,
    select?: Prisma.JournalSelect
) => {
    return ( await prisma.journal.update({ where, data, select})) as Journal;
}

// delete Journal

export const deleteJournalService = async( input: Prisma.JournalWhereUniqueInput) => {
    return (await prisma.journal.delete({
        where: input,
    })) as Journal
}


