import {Request, Response} from "express"
import {FollowsDatabase} from "../data/FollowsDatabase"
import Authenticator from "../services/utils/Authenticator";


const useFollowsDB = new FollowsDatabase;
const authenticator = new Authenticator;

export const followUser = async (req: Request, res: Response) =>{
    try {
        if(!req.body.userToFollowId){
            throw new Error("Send an id to follow")
        }
        const user = authenticator.getData(req.headers.authorization)
        await useFollowsDB.followUser(user.id, req.body.userToFollowId)
        res.status(200).send({message: "Followed successfully"})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}