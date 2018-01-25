package com.farot.utils;

import spark.Request;
import spark.Response;

import java.util.Date;
import java.util.List;

import com.farot.models.AccountModel;

import com.farot.utils.Sql2oModel;

public class Auth {

    public Auth () 
    {

    }

    public static AccountModel getByToken (String token) throws Exception
    {
        try {
            List<AccountModel> models = Sql2oModel.AccountConnector.getByToken(token);
            if (models.size() > 0) {
                AccountModel model = models.get(0);

                model.last_login = new Date();

                Sql2oModel.AccountConnector.update(model);

                return model;
            } else {
                throw new Exception("No user with this token");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    public static AccountModel getUser (Request req) throws Exception 
    {
        String token = req.headers("FAROT-TOKEN"), 
            cookie = req.cookie("token");
        AccountModel user;

        try {
            user =    req.session().attribute("user");
            if (user == null) {
                if (token != null) {
                    user = getByToken(token);
                } else {
                    if (cookie != null) {
                        user = getByToken(cookie);
                    } else {
                        throw new Exception("No token or cookie");
                    }
                }
                req.session().attribute("user", user);
            }
        } catch (Exception e) {
            throw e;
        }

        return user;
    }

}