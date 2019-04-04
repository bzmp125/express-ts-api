import { Request, Response } from "express";
import { missingPars, response } from "../../helpers";
import { logger } from "logger";
import { Cat } from "../../interfaces";

export default (req: Request, res: Response) => {
    const tags = ['create-cat'];
    const requiredPars = ['name', 'description'];
    const missing = missingPars(requiredPars, req.body); // returns an array of missing parameters from req.body
    if (missing.length > 0) {
        // there are missing parameters from the request
        logger.error(`Missing or invalid parameters from request, missing: ${missing.join(',')}.`, { tags: [...tags, 'missing-or-invalid-pars', 'create-cat-missing-or-invalid-pars'] });
        res.json(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
    } else {
        // request body is ok
        const { name, description } = req.body;

        try {
            setTimeout(() => {
                const id = '53289018901201239012' // auto generated id e.g database id.

                const newCat: Cat = {
                    id,
                    name,
                    description,
                }

                // add optional age
                if (req.body.age !== null) {
                    newCat.age = parseInt(req.body.age);
                }

                // save to database

                // respond
                res.json(response(true, "CAT CREATED.", newCat));
                logger.info(`New Cat ${newCat.name} created with ID ${newCat.id}`, { tags: [...tags, 'cat-created'] })


            }, Math.random() * 1000)

        } catch (e) {
            logger.error(`Exception when creating cat, e: ${e}`, { tags: [...tags, 'exception', 'createCat-exception']});
            res.status(500).json(response(false, "FAILED TO CREATE CAT."));
        }
    }
}
