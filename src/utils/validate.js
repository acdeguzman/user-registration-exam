const validateParameters = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req);
        if(error) {
            return res
                .status(400)
                .json({
                    error: {
                        message: 'Invalid request',
                        details: error.details[0].message
                    }
                })
        }

        next();
    }
}


module.exports = validateParameters;