import { Request, Response } from "express";
import { response, getAllCats } from "../../helpers";
import { logger } from "../../logger";

export default async (req: Request, res: Response) => {
    const tags = ['get-cats'];
    try {
        const cats = await getAllCats();
        const catsFound = cats.length > 0;

        if (catsFound) {
          res.json(response(true, "CATS FOUND.", cats));
        } else {
          res.json(response(false, "CATS NOT FOUND."));
        }

        // add useful log
        logger.info(`Cats ${catsFound ? "found" : "not found"}.`);
    } catch (e) {
        res.json(response(false, "FAILED TO GET CATS."));
        logger.error(`Exception when getting cats, e: ${e}`, { tags: [...tags, 'exception', 'getCats-exception'] })
    }
}
