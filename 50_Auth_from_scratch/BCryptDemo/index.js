const bcrypt = require('bcrypt');

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 12; // recommened number
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('salt:', salt);

    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
}

hashPassword('khumbiet').then(async (hashedPassword) => {
    console.log('hashedPassword:', hashedPassword);
    const matched = await bcrypt.compare('khumbiet', hashedPassword);
    console.log(matched);
});
