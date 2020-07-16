import {BaseDatabase} from '../services/BaseDatabase'

export class FollowsDatabase extends BaseDatabase{
    public async followUser(userId: string, userToFollowId: string): Promise<void>{
        try {
            await this.getConnection().insert({user_id: userId, user_follow_id: userToFollowId}).into(process.env.FOLLOWS_DB_NAME)
        } catch (error) {
            throw new Error(error.sqlMessage)
        }
    }

    public async unfollowUser(userId: string, userToUnfollowId: string): Promise<void>{
        try {
            await this.getConnection().delete().from(process.env.FOLLOWS_DB_NAME).where({user_id: userId, user_follow_id: userToUnfollowId})
        } catch (error) {
            throw new Error(error.sqlMessage)
        }
    }

    public async getFeed(userId: string): Promise<any>{
        try {
            const feed = await this.getConnection()
                .select(`${process.env.RECIPES_DB_NAME}.id as id`, 
                    `${process.env.RECIPES_DB_NAME}.title as title`, 
                    `${process.env.RECIPES_DB_NAME}.description as description`, 
                    `${process.env.RECIPES_DB_NAME}.created_at as createdAt`, 
                    `${process.env.RECIPES_DB_NAME}.creator_id as userId`,
                    `${process.env.USER_DB_NAME}.name as userName
                `)
                .from(process.env.RECIPES_DB_NAME)
                .join(process.env.FOLLOWS_DB_NAME, `${process.env.RECIPES_DB_NAME}.creator_id`,
                    `${process.env.FOLLOWS_DB_NAME}.user_follow_id
                `)
                .join(process.env.USER_DB_NAME, `${process.env.RECIPES_DB_NAME}.creator_id`, 
                    `${process.env.USER_DB_NAME}.id
                `)
                .where(process.env.FOLLOWS_DB_NAME+".user_id", "=", userId)
                .orderBy(process.env.RECIPES_DB_NAME+".created_at", "DESC")
            return feed;
        } catch (error) {
            throw new Error(error.sqlMessage)
        }
    }
}