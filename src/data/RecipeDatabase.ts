import {BaseDatabase} from "../services/BaseDatabase"
import IdGenerator from "../services/utils/IdGenerator"
import knex from "knex"

export class RecipeDatabase extends BaseDatabase{
    public async createRecipe(title: string, description: string, owner_id: string): Promise<void>{
        try{
            const idGenerator = new IdGenerator;

            const recipeId = idGenerator.generate();

            await this.getConnection().insert({id: recipeId, title, description, owner_id}).into(process.env.RECIPES_DB_NAME)
        }
        catch(error){
            throw new Error(error.sqlMessage);
        }
    }

    public async getRecipeById(id: string): Promise<any>{
        try {
            const recipe = await this.getConnection().select("*").from(process.env.RECIPES_DB_NAME).where("id", "=", id);
            
            return recipe;
        } catch (error) {
            throw new Error(error.sqlMessage);
        }
    }
}