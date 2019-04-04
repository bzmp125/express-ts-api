import { Request, Response } from "express";
import { response, getCatById } from "../../helpers";
import { logger } from "../../logger";

export default async (req: Request, res: Response) => {
    const tags = ['get-cats'];
    try {
        const catId = req.params.catId;

        const cat =  await getCatById(catId);

        const catIsFound = cat !== null;

        if (catIsFound) {
            res.json(response(true, "CAT FOUND.", cat));
        } else {
            res.json(response(false, "CAT NOT FOUND."));
        }

        // log some useful information here.
        logger.info(`Cat ${catId} ${(catIsFound) ? 'found' : 'not found'}.`);

    } catch (e) {
        res.json(response(false, "FAILED TO GET CATS."));
        logger.error(`Exception when getting cats, e: ${e}`, { tags: [...tags, 'exception', 'getCats-exception'] })
    }
}