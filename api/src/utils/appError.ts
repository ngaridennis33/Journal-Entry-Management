export default class AppError extends Error {
    status: string;

    constructor(public statusCode: number = 500, public message: string = "Internal Server Error") {
        super(message);

        // Determine the status based on the first digit of the statusCode
        switch (true) {
            case statusCode >= 200 && statusCode < 300:
                this.status = 'success';
                break;
            case statusCode >= 300 && statusCode < 400:
                this.status = 'redirect';
                break;
            case statusCode >= 400 && statusCode < 500:
                this.status = 'clientError';
                break;
            case statusCode >= 500 && statusCode < 600:
                this.status = 'serverError';
                break;
            default:
                this.status = 'unknown'; // Handle unknown status codes
        }
    }
}
