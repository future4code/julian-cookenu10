import {Request, Response} from "express"
import {RecipeDatabase} from "../data/RecipeDatabase"
import Authenticator from "../services/utils/Authenticator";
import IdGenerator from "../services/utils/IdGenerator"
import moment from 'moment';

const useRecipeDB = new RecipeDatabase;
const authenticator = new Authenticator;
const idGenerator = new IdGenerator;

export const createRecipe = async(req: Request, res: Response) =>{
    try {
        const tokenData = authenticator.getData(req.headers.authorization);
        const recipeId = idGenerator.generate();
        await useRecipeDB.createRecipe(recipeId, req.body.title, req.body.description, tokenData.id);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

export const getRecipe = async(req: Request, res: Response) => {
    try {
        authenticator.getData(req.headers.authorization)
        const recipe = await useRecipeDB.getRecipeById(req.params.id);
        const {id, title, description, created_at} = recipe
        res.status(200).send({id, title, description, createdAt: moment(created_at).format("DD/MM/YYYY")});
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

export const editRecipe = async(req: Request, res: Response) => {
    try {
        if(req.body.title === "" || req.body.description === "" || !req.params.id){
            throw new Error("Invalid parameters")
        }
        const user = authenticator.getData(req.headers.authorization)
        if(user.role==="NORMAL"){
            const recipe = await useRecipeDB.getRecipeById(req.params.id);
            if(recipe.creator_id!==user.id){
                throw new Error("You can only edit your own recipes")
            }
        }
        await useRecipeDB.editRecipe(req.params.id, req.body.title, req.body.description)
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({message:error.message});
    }
}

export const deleteRecipe = async (req:Request, res: Response) => {
    try {
        const user = authenticator.getData(req.headers.authorization)
        if(user.role==="NORMAL"){
            const recipe = await useRecipeDB.getRecipeById(req.params.id);
            if(recipe.creator_id!==user.id){
                throw new Error("You can only delete your own recipes")
            }
        }
        await useRecipeDB.deleteRecipe(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}