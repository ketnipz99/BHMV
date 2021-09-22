package com.fyp.aes;

import com.fyp.aes.AES_Utility;

import javax.crypto.SecretKey;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

public class EncryptFile {

    private static final int IV_LENGTH_BYTE = 12;
    private static final int KEY_LENGTH_BYTE = 256;

    public static void main (String[] args) throws Exception {

        //12 bytes IV
        byte[] iv = AES_Utility.getRandomNonce(IV_LENGTH_BYTE);
        //AES 256 bits (32 bytes)
        SecretKey secretKey = AES_Utility.generateSecretKey(KEY_LENGTH_BYTE);

        //solve the harcoding issue for file retrieval and storage
        String toEncrypt = "C:\\Users\\User\\Documents\\Dev\\EHR";
        String storeEncrypted = "C:\\Users\\User\\Documents\\Dev\\EncryptedFile";
        String storeDecrypted = "C:\\Users\\User\\Documents\\Dev\\DecryptedFile";

        //Path toEncDir = Paths.get(toEncrypt);

        encryptFile(toEncrypt, storeEncrypted, secretKey, iv);
        //decryptFile(storeEncrypted, storeDecrypted, secretKey, iv);
    }

    public static void encryptFile (String originFile, String destFile, SecretKey secretKey, byte[] initVec ) throws Exception {

        int counter = 1;
        File directory = new File(originFile);
        File[] files = directory.listFiles();
        //fetch all files in the directory(folder)

        for (File file : files) {
            if (file.isFile()) {
                byte[] readFile = Files.readAllBytes(Paths.get(String.valueOf(file)));
                byte[] encryptedFile = EncDecryptor.encrypt(readFile, secretKey, initVec);

                //create and save new text file for each EHR
                String ciphertextFile = (destFile + "\\ehr_" + counter + ".txt");
                Path path = Paths.get(ciphertextFile);
                Files.write(path, encryptedFile);
            }
            counter++;
        }
        /*
        //read the text file from directory toEncrypt
        byte[] readFile = Files.readAllBytes(Paths.get(originFile));

        //call EncDecryptor class for encryption first
        byte[] encryptedFile = EncDecryptor.encrypt(readFile, secretKey, initVec);

        //save a file
        Path path = Paths.get(destFile);
        Files.write(path, encryptedFile);
        */
    }


    public static void decryptFile (String originFile, String destFile, SecretKey secretKey, byte[] initVec) throws Exception {

        File directory = new File(originFile);
        File[] files = directory.listFiles();
        //fetch all encrypted file for decryption

        for (File file : files) {
            if (file.isFile()) {
                byte[] readEncFile = Files.readAllBytes(Paths.get(String.valueOf(file)));
                byte[] decryptedFile = EncDecryptor.decrypt(readEncFile, secretKey, initVec);

                String decryptedCipherFile = (destFile + "\\" + file + "_decrypted");
                Path path = Paths.get(decryptedCipherFile);
                Files.write(path, decryptedFile);
            }
        }

    }


}
