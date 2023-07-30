const bcrypt = require('bcrypt');

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 12; // recommended number
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('salt:', salt);

    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
}

hashPassword('khumbiet').then(async (hashedPassword) => {
    console.log('hashedPassword:', hashedPassword);
    const matched = await bcrypt.compare('khumbiet', '$2b$12$jLxpA6.D156bJr2I51SIx.llvRp98WEqnV4cAXwc0sUPco16g5gkm');
    console.log(matched);
});

// some generated hashes
'$2b$12$7OVAx8rK44vrBLGUHJYjT.W5H8l0r9OSDUXgEY8eO0S3ONQwOR1ym'
'$2b$12$jLxpA6.D156bJr2I51SIx.llvRp98WEqnV4cAXwc0sUPco16g5gkm'
'$2b$12$NcYloXkE34DJ/3uw.AXu9OCpidE1Sun7dyvYUJ3Aytp4uONa2nSEe'