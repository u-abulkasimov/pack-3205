import { Response, Request, NextFunction } from 'express';
import TEmail from '../types/Email';
import path from 'path';
import fs from 'fs';
import ApiException from '../exception/ApiException';
import { validationResult, body } from 'express-validator';

class Email {
    /**
     * Search email by email and number
     */
    async search(req: Request, res: Response, next: NextFunction): Promise<any> {
        const me = this;
        const { email, number } = req.body || {};        
        
        // after data validation wait 5000 seconds for response
        await me.wait(async () => {
            try {
                const data = await me.load();
                const find = data.find((item) => item.email === email && item.number.toString() === number);
    
                if (!find) {
                    throw ApiException.InvalidParameter('Record not found');
                }
    
                return res.status(200).json({
                    success: true,
                    data: find
                });
            } catch (e) {
                next(e);
            }        
        });
    }

    /**
     * Helps to emit server response
     */
    async wait(cb: Function, delay: number = 5000): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(cb());
            }, delay);
        });
    }

    /**
     * Validate search parameters
     */
    searchValidate() {
        const MAX_LENGTH = 6;
        const validations = [
            body('email')
                .isEmail()
                .withMessage('Invalid email field'),
            body('number')
                .isLength({ min: MAX_LENGTH, max: MAX_LENGTH })
                .withMessage('Number field must be length 6')
                .isNumeric()
                .withMessage('Number field must be numeric')
        ];        

        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors = validationResult(req);

            // if no errors found
            if (errors.isEmpty()) {
                return next();
            }
            
            const err = ApiException.InvalidParameter(errors.array()); 
            
            return next(err);    
        };
    }

    /**
     * Load e-mails data from JSON file   
     */
    async load(): Promise<TEmail[]> {
        const filePath = path.resolve(__dirname, '../data/emails.json');
        const data = await fs.readFileSync(filePath);

        return JSON.parse(data.toString());
    }
}

module.exports = new Email();