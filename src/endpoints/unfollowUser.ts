import {Request, Response} from "express"
import {FollowsDatabase} from "../data/FollowsDatabase"
import Authenticator from "../services/utils/Authenticator";

const useFollowsDB = new FollowsDatabase;
const authenticator = new Authenticator;

export const unfollowUser = async (req: Request, res: Response) =>{
    try {
        if(!req.body.userToUnfollowId){
            throw new Error("Send an id to unfollow")
        }
        const user = authenticator.getData(req.headers.authorization)
        await useFollowsDB.unfollowUser(user.id, req.body.userToUnfollowId)
        return res.status(200).send({message: "Unfollowed successfully"})
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
}