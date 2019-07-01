import * as Q from "bull";
import { bullRedisURL } from "../../settings";
import sendEmailProcessor from "./processors/sendEmailProcessor";

const SendEmailQueue = new Q("send-email", bullRedisURL);
SendEmailQueue.process(sendEmailProcessor);

//if you just need a queue
export const Queue = Q;

//already prepared queues
export const sendEmailQueue = SendEmailQueue;
