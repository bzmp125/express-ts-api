import CommonResponse from "../interfaces/CommonResponse";

// constructing a response object for res.json()

export default (success: boolean, message: string, data?:any) => {
    let tmp:CommonResponse<any> = {
        success,
        message
    }
    if(data) tmp.data = data;
    return tmp;
}
