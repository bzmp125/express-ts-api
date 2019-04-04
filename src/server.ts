require("dotenv").config();
import { logger } from './logger';
import app from './app';
const port = process.env.PORT || 9000;

const tags = 'server, startup';
app.listen(port, ()=> {
    logger.info(`Server running on ${port}`,{ tags })
})