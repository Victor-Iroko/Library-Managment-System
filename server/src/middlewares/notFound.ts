import {Response, Request} from "express"


export const notFound = (req: Request, res: Response) => {
    req = req;
    res.status(404).json({message: "Route does not exist"})
}