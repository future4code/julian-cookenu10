import {Request, Response} from "express"
import {RecipeDatabase} from "../data/RecipeDatabase"
import Authenticator from "../services/utils/Authenticator";

const useRecipeDB = new RecipeDatabase;
const authenticator = new Authenticator;

export const createRecipe = async(req: Request, res: Response): Promise<void> =>{
    try {
        const tokenData = authenticator.getData(req.headers.authorization);
        await useRecipeDB.createRecipe(req.body.title, req.body.description, tokenData.id);
        res.status(200).send({message: "Recipe created successfully"});
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

export const getRecipe = async(req: Request, res: Response): Promise<any> => {
    try {
        const tokenData = authenticator.getData(req.headers.authorization)
        const recipe = await useRecipeDB.getRecipeById(req.params.id);
        res.status(200).send(recipe);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}