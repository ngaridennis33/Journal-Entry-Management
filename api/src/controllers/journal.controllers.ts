import { NextFunction, request, Request, Response } from "express";
import { CategoryJournalInput, DeleteJournalInput, JournalInput, UpdateJournalInput } from "../schema/journal.schema";
import { createJournalService, deleteJournalService, findJournalByCategoryService, findJournalService, getAllJournalsService, updateJournalService } from "../services/journalService";
import AppError from "../utils/appError";


// Create a New Journal

export const createJournalHandler = async(
    req: Request<{},{}, JournalInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, description, category } = req.body;
        const journal = await createJournalService({
            title: title,
            description: description,
            category: category
        })

        res.status(200).json({
            status: 'success',
            data: journal,
        })
        
    } catch (error: any) {
        next(error);
        
    }
}


// Get All Journals

export const getAllJournalsHandler = async(
    req: Request,
    res: Response,
    next:NextFunction
) => {
    try {
        
        const journals = await getAllJournalsService();
        res.status(200).json({
            status: 'success',
            data: journals
        })
    } catch (error: any) {
        next(error)
    }
}


// Get a specific Journal

export const getSpecificJournalsHandler = async(
    req: Request,
    res: Response,
    next:NextFunction
) => {
    try {

        const { id } = req.params;

        const journal = await findJournalService({ id });

        if(!journal){
            return res.status(404).json({
                status: 'error',
                message: 'Journal Not found!'
            })
        }

        res.status(200).json({
            status: 'success',
            data: journal
        })

    } catch (error: any) {
        next(error)
    }
}


// Get Journal By Category

export const getJournalByCategoryHandler = async(
    req: Request<CategoryJournalInput>,
    res: Response,
    next:NextFunction
) => {
    try {
        const { category } = req.params;
        const journals = await findJournalByCategoryService({category})
        
        if(!journals){
            return next(new AppError(404, 'Category Does NOT exist'))
        }
        
        res.status(200).json({
            status: 'success',
            data: journals
        })

    } catch (error: any) {
        next(error)
    }
}


// Update Journal

export const updateJournalHandler = async(
    req: Request<UpdateJournalInput['params'],{}, UpdateJournalInput['body']>,
    res: Response,
    next:NextFunction
) => {
    try {

        const { id } = req.params;
        const { title, description, category } = req.body;
        const journal = await findJournalService({id});
        
        if(!journal) {
            return next (new AppError(404, 'Journal does Not Exist'))
        }

        const updatedJournal = await updateJournalService(
            { id: journal.id},
            {
                title,
                description,
                category,
            }
        )
        res.status(200).json({
            status: 'success',
            data: updatedJournal
        })


    } catch (error: any) {
        next(error)
    }
}


// Delete Journal

export const deleteJournalHandler = async(
    req: Request<DeleteJournalInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const journal = await findJournalService({id});

        if(!journal){
            return next(new AppError(404, 'Journal Does NOT exist'))
        }

        await deleteJournalService({id: journal.id})
        
        res.status(200).json({
            status: 'success',
            message: 'Journal Deleted successfully!'
        })

        
    } catch (error: any) {
        next(error)
    }
}