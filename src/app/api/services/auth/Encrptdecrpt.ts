
import crypto from 'crypto';
//const SECRET_KEY = "79a3ded0209240a2a04eecb46e5ca9de";
//const SECRET_KEY = "2f024568d61269596fe3f08e6472d3eb9ed0219a11d1a420feef6f395a51caf616f61f35de7c18c422b8f7458c8a07bf068ea70040b814640b713f3c3d276965";
//const SECRET_KEY =  "2f024568d61269596fe3f08e6472d3eb";

 
// Function to encrypt plain text
export function encryptData(plainText : string , secret_key_param : string ) {
 
  //  console.log('secret key dynamic is',secret_key_param);
   
   if(process.env.SECRET_KEY_API ="")
   {
    process.env.SECRET_KEY_API = secret_key_param;
    
   } 
   const key = Buffer.from(secret_key_param.slice(0, 64), 'hex').slice(0, 32);

    // Generate a random 16-byte IV
    const iv = crypto.randomBytes(16);

    // Encrypt using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return encrypted data and IV (both in Hex format)
    return {
        // encryptedData: encrypted,
        // key: iv.toString('hex'),
         Data : "1n7i5t2i3" +encrypted  + "n7i5t2i3" + iv.toString('hex')
    };
  //  if(secret_key_param ="")
  //  {
  //   secret_key_param = process.env.SECRET_KEY_API ;
  //  }
   // console.log('Process auth data is',process.env.SECRET_KEY_API);
  //   const key = Buffer.from(secret_key_param.slice(0,32), 'utf8');
  //   console.log('Plaintext in Encryption is',plainText);
  //   console.log('Key in encryption is',secret_key_param.slice(0,32));
  //   const iv = crypto.randomBytes(16); // Generate random IV
  //  // console.log('iv is ',iv);
  //   const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  //   let encrypted = cipher.update(plainText, 'utf8', 'hex');
  //   encrypted += cipher.final('hex');
  //   process.env.SECRET_KEY_IV = iv.toString('hex');
  //   return {
  //       encryptedData: encrypted,
  //       key: iv.toString('hex')
  //   };
}

// Function to decrypt encrypted data


export function decryptDataforResponse(Data: any, secret_key_param: string) {
  
 let response=Data?.data

  // Ensure the secret key is the same as the one used for encryption
  if (process.env.SECRET_KEY_API === "") {
    process.env.SECRET_KEY_API = secret_key_param;
  }
 

  const encryptedStart = response.split('n7i5t2i3');
// console.log(encryptedStart[0], encryptedStart[1],encryptedStart[2]);

  
  // console.log("Encrypted Content:",  encryptedStart[1]);
  // console.log("IV (Hex):", encryptedStart[2]);

  // Prepare the key and IV
  const key = Buffer.from(secret_key_param.slice(0, 64), 'hex').slice(0, 32);
  const ivBuffer = Buffer.from(encryptedStart[2], 'hex');  // IV comes from the encryption step

  // Create decipher with AES-256-CBC, using the same key and IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);
  
  // Decrypt the data
  let decrypted = decipher.update(encryptedStart[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');


  return decrypted;
}

// export function decryptData(encryptedData: string, iv: string) {
//     // console.log('encryptedData',encryptedData);
//     // console.log('iv',iv);

//     const key = Buffer.from(SECRET_KEY, 'utf8');
  
//     const ivBuffer = Buffer.from(iv, 'hex');
//     // console.log('key in decryption is',key);
//     // console.log('iv in decryption is',ivBuffer);
//     const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);
//     let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');

//     return decrypted;
// }


// export function decryptToken(encryptedData: string, secret_key_param: string, iv_hex: string) {
//     // Ensure the key is 32 bytes (256 bits) by slicing or padding
//     const key = Buffer.from(secret_key_param.slice(0, 32), 'utf8');
  
//     // Convert the IV from hex back to a Buffer
//     const iv = Buffer.from(iv_hex, 'hex');
  
//     // Create a decipher instance with the same algorithm, key, and IV
//     const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
//     try {
//       // Decrypt the data
//       let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//       decrypted += decipher.final('utf8'); // Finalize the decryption
  
//       // console.log('Decrpted data in decrypt token is',decrypted);
//       return decrypted;
//     } catch (error) {
//       console.error('Decryption failed:', error);
//       throw new Error('Decryption failed');
//     }
// }

 
