const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const encrypt = async (data) => {

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const encryptedData = await bcrypt.hash(data, salt);

    return encryptedData;
}

// used to compare passwords
const compare = async (current_password, input_password) => {

    const result = await bcrypt.compare(current_password, input_password);
    return result;
}

module.exports = {
    encrypt,
    compare
};