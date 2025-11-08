
export const validateBody = (joiSchema) => {
    return (req, res, next) => {
        const { value, error } = joiSchema.validate(req.body);

        // היתה שגיאה
        if (error) {
            return res.status(400).json({ error: { message: error.details[0].message } });
        }

        return next();
    };
};