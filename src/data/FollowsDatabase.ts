import {BaseDatabase} from '../services/BaseDatabase'

export class FollowsDatabase extends BaseDatabase{
    public async followUser(userId: string, userToFollowId: string): Promise<void>{
        try {
            await this.getConnection().insert({user_id: userId, user_follow_id: userToFollowId}).into(process.env.FOLLOWS_DB_NAME)
        } catch (error) {
            console.log(error)
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
}