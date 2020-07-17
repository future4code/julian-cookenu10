import {BaseDatabase} from "../services/BaseDatabase"

export class RecipeDatabase extends BaseDatabase{
    public async createRecipe(recipeId: string, title: string, description: string, creator_id: string): Promise<void>{
        try{
            await this.getConnection().insert({id: recipeId, title, description, creator_id}).into(process.env.RECIPES_DB_NAME)
        }
        catch(error){
            throw new Error(error.sqlMessage);
        }
    }

    public async getRecipeById(id: string): Promise<any>{
        try {
            const recipe = await this.getConnection().select("*").from(process.env.RECIPES_DB_NAME).where("id", "=", id);
            return recipe[0];
        } catch (error) {
            throw new Error(error.sqlMessage);
        }
    }

    public async editRecipe(id: string, title: string, description: string): Promise<any>{
        try {
            await this.getConnection().update({title, description}).from(process.env.RECIPES_DB_NAME).where("id", "=", id);
        } catch (error) {
            throw new Error(error.sqlMessage);
        }
    }

    public async deleteRecipe(id: string): Promise<any>{
        try {
            await this.getConnection().delete().from(process.env.RECIPES_DB_NAME).where("id", "=", id);
        } catch (error) {
            throw new Error(error.sqlMessage);
        }
    }
}
