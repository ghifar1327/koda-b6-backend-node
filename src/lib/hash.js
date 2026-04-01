import argon2 from "argon2";

/**
 * @param {string} password
 * @returns {string}
 */
export async function GenerateHash(password){
    const hash = await argon2.hash(password);
    return hash;
}

/**
 * 
 * @param {string} hash 
 * @param {string} plainText 
 * @returns {boolean}
 */
export async function VerifyHash(hash ,plainText) {
    try{
        const isVerified = await argon2.verify(hash , plainText);
        return isVerified;
    }catch{
        return false;
    }
}