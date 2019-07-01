import * as debug from "debug";
import { serviceUrl } from "../settings";

export { default as response } from "./Response/ApplicationResponse";
export { default as logger } from "./logger";

export * from "./auth";
export * from "./runner";

export function missingPars(requiredPars: string[], pars: any): string[] {
  return requiredPars.filter(par => pars[par] == null);
}

export function generateCode(length: number = 8) {
  return Math.random()
    .toString()
    .slice(2, length < 8 ? length : 8);
}

export const log = debug("server");

export function censorEmail(email: string) {
  if (email.indexOf("@") == -1) return email.replace("", "*");

  const emailParts = email.split("@");
  const username: string = emailParts[0];
  const domain = emailParts[1];
  const censoredUsername = `${username.slice(0, 2)}${username
    .slice(2)
    .replace("", "*")}`;
  return `${censoredUsername}@${domain}`;
}

export function generatePasswordChangeLink(code: string | number) {
  return `${serviceUrl}/change-password/${code}`;
}
