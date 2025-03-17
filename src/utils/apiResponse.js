class apiResponse {
    constructor(statusCode = 200 , message = "Success" , data ) {
        this.statusCode = statusCode,
        this.message = message,
        this.data = data,
        this.success = statusCode<400
    }
}

export { apiResponse }
