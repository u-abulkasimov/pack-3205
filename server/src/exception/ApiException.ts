import TApiException from '../types/Exception';

class ApiException extends Error {
    
    status;
    errors;

    constructor(status: number, message:string, errors: TApiException = []) {
        super(message);
        this.status = status;        
        this.errors = errors;
    }

    static BadRequest(errors: TApiException = []) {        
        return new ApiException(400, 'Bad Request', errors);
    }

    static InvalidParameter(errors: TApiException = []) {
        return new ApiException(400, 'Invalid parameter', errors);
    }
}

export default ApiException;