package com.farot.controllers;

import spark.Request;
import spark.Response;

import java.math.BigInteger;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import com.google.gson.Gson;

import java.util.UUID;
import java.util.Date;
import java.util.List;

import com.farot.models.ResponseModel;
import com.farot.models.AccountModel;
import com.farot.models.AccountResponseModel;

import com.farot.utils.Sql2oModel;
import com.farot.utils.RandomString;
import com.farot.utils.Auth;

public class AccountController {

    private static Gson gson = new Gson();

    public AccountController () 
    {

    }

    private static String generateStorngPasswordHash(String password) throws NoSuchAlgorithmException, InvalidKeySpecException
    {
        int iterations = 1000;
        char[] chars = password.toCharArray();
        byte[] salt = getSalt();
         
        PBEKeySpec spec = new PBEKeySpec(chars, salt, iterations, 64 * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] hash = skf.generateSecret(spec).getEncoded();
        return iterations + ":" + toHex(salt) + ":" + toHex(hash);
    }
     
    private static byte[] getSalt() throws NoSuchAlgorithmException
    {
        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        return salt;
    }
     
    private static String toHex(byte[] array) throws NoSuchAlgorithmException
    {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int paddingLength = (array.length * 2) - hex.length();
        if (paddingLength > 0) {
            return String.format("%0"    +paddingLength + "d", 0) + hex;
        } else {
            return hex;
        }
    }

    private static boolean validatePassword(String originalPassword, String storedPassword) throws NoSuchAlgorithmException, InvalidKeySpecException
    {
        String[] parts = storedPassword.split(":");
        int iterations = Integer.parseInt(parts[0]);
        byte[] salt = fromHex(parts[1]);
        byte[] hash = fromHex(parts[parts.length-1]);
         
        PBEKeySpec spec = new PBEKeySpec(originalPassword.toCharArray(), salt, iterations, hash.length * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] testHash = skf.generateSecret(spec).getEncoded();
         
        int diff = hash.length ^ testHash.length;
        for(int i = 0; i < hash.length && i < testHash.length; i++)
        {
            diff |= hash[i] ^ testHash[i];
        }
        return diff == 0;
    }

    private static byte[] fromHex(String hex) throws NoSuchAlgorithmException
    {
            byte[] bytes = new byte[hex.length() / 2];
            for(int i = 0; i<bytes.length ;i++)
            {
                bytes[i] = (byte)Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
            }
            return bytes;
    }
    
    public static Object create (Request req, Response res) 
    {
        res.type("application/json");

        try {
            AccountModel model = gson.fromJson(req.body(), AccountModel.class);

            List<AccountModel> models = Sql2oModel.AccountConnector.getByLogin(model.login);
            if (models.size() == 0) {
                model.id                 = UUID.randomUUID();
                model.pass             = generateStorngPasswordHash(model.pass);
                model.token            = RandomString.generateRandomString();
                model.last_login = new Date();
                model.user_id        = UUID.randomUUID();

                System.out.println("Id: " + model.id + " password " + model.pass);
                
                Sql2oModel.AccountConnector.create(model);

                return new ResponseModel(1, new AccountResponseModel(model));                
            } else {
                throw new Exception("User with this login already exists");
            }
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }

    }

    public static Object auth (Request req, Response res)
    {
        res.type("application/json");

        try {
            AccountModel data = gson.fromJson(req.body(), AccountModel.class);

            System.out.println("Post to auth in controller! " + data.login);

            List<AccountModel> models = Sql2oModel.AccountConnector.getByLogin(data.login);

            if (models.size() > 0) {
                AccountModel model = models.get(0);

                if (validatePassword(data.pass, model.pass)) {
                    model.token            = RandomString.generateRandomString();
                    model.last_login = new Date();

                    Sql2oModel.AccountConnector.update(model);

                    res.cookie("token", model.token);
                    req.session().attribute("user", model);

                    return new ResponseModel(1, new AccountResponseModel(model));
                } else {
                    throw new Exception("No such password");
                }

            } else {
                throw new Exception("No such user");
            }
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }

    }

    public static Object checkAuth (Request req, Response res)
    {
        res.type("application/json");

        try {
            return new ResponseModel(1, new AccountResponseModel(Auth.getUser(req)));
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }

    }

    public static Object logout (Request req, Response res)
    {
        res.type("application/json");
        AccountModel user;

        try {
            user = Auth.getUser(req);
            user.token = RandomString.generateRandomString();
            Sql2oModel.AccountConnector.update(user);
            res.removeCookie("token");
            req.session().removeAttribute("user");
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }

        return new ResponseModel(1, new AccountResponseModel(user));
    }

}