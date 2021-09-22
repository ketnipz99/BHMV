package com.fyp.aes;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.ByteBuffer;
import java.util.Base64;

public class EncDecryptor {

    private static final String ENCRYPT_ALGO = "AES/GCM/NoPadding";
    private static final int TAG_LENGTH_BIT = 128;


    public static byte[] encrypt (byte[] inFile, SecretKey secret, byte[] iv) throws Exception {


        Cipher cipher = Cipher.getInstance(ENCRYPT_ALGO);

        cipher.init(Cipher.ENCRYPT_MODE, secret, new GCMParameterSpec(TAG_LENGTH_BIT, iv));

        byte[] encryptedFile = cipher.doFinal(inFile);

        return encryptedFile;

    }

    public static byte[] decrypt (byte[] cipherFile, SecretKey secret, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(ENCRYPT_ALGO);

        cipher.init(Cipher.DECRYPT_MODE, secret , new GCMParameterSpec(TAG_LENGTH_BIT, iv));

        byte[] plainFile = cipher.doFinal(cipherFile);

        return plainFile;
    }



}
