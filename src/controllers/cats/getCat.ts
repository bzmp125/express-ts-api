import { Request, Response } from "express";
import cats from '../../data/cats';
import { response } from "../../helpers";
import { logger } from "../../logger";

export default (req: Request, res: Response) => {
    const tags = ['get-cats'];
    try {
        const catId = req.params.catId;

        // using setTimeout to simulate a async process e.g. reading from database.
        setTimeout(() => {
            const cat = cats.filter(cat => cat.id === catId)[0];
            const catFound = cat !== null;
            if (catFound) {
                res.json(response(true, "CAT FOUND.", cat));
            } else {
                res.json(response(false, "CAT NOT FOUND."));
            }

            // log some useful information here.
            logger.info(`Cat ${catId} ${(catFound) ? 'found' : 'not found'}.`);

        }, Math.random() * 1000);
    } catch (e) {
        res.json(response(false, "FAILED TO GET CATS."));
        logger.error(`Exception when getting cats, e: ${e}`, { tags: [...tags, 'exception', 'getCats-exception'] })
    }
}