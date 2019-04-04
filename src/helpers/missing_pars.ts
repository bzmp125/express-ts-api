// missing parameters from a request
export default (requiredPars: string[], passedPars: string[]) : string[] => {
    return requiredPars.filter(par => !passedPars[par]);
}
