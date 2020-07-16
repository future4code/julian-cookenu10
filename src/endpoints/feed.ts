import {Request, Response} from "express"
import {FollowsDatabase} from '../data/FollowsDatabase'
import Authenticator from '../services/utils/Authenticator'
import moment from 'moment'

const authenticator = new Authenticator;
const userFollowsDB = new FollowsDatabase;

export const userFeed = async(req: Request, res: Response) => {
    try {
        const user = authenticator.getData(req.headers.authorization);
        const feed = await userFollowsDB.getFeed(user.id);
        feed.forEach((recipe: any )=> {
            recipe.createdAt = moment(recipe.createdAt).format("DD/MM/YYYY");
        })
        res.status(200).send({recipes: feed});
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}