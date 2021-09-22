package com.fyp.aes;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class AES_Utility {

    //Initialization vector
    public static byte[] getRandomNonce (int bytesNum) {
        byte[] nonce = new byte[bytesNum];
        new SecureRandom().nextBytes(nonce);
        return nonce;
    }

    //Generate AES key
    public static SecretKey generateSecretKey (int keySize) throws NoSuchAlgorithmException {
        //Initialize AES algorithm instance
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(keySize, SecureRandom.getInstanceStrong());
        return keyGenerator.generateKey();
    }
}
