import { Request, Response } from "express";
import cats from '../../data/cats';
import { response } from "../../helpers";
import { logger } from "../../logger";

export default (req: Request, res: Response) => {
    const tags = ['get-cats'];
    try {
        setTimeout(() => {
            // using setTimeout to simulate a async process e.g. reading from database.
            res.json(response(true, "CATS FOUND.", cats));
            // add useful log
            logger.info('Cats found.', { tags: [...tags, 'cats-found'] })
        }, Math.random() * 1000);
    } catch (e) {
        res.json(response(false, "FAILED TO GET CATS."));
        logger.error(`Exception when getting cats, e: ${e}`, { tags: [...tags, 'exception', 'getCats-exception'] })
    }
}
