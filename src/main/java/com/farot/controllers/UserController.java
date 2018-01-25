package com.farot.controllers;

import spark.Request;
import spark.Response;

import com.google.gson.Gson;

import com.farot.models.ResponseModel;
import com.farot.models.AccountModel;
import com.farot.models.AccountResponseModel;

import com.farot.utils.Sql2oModel;
import com.farot.utils.Auth;

public class UserController {

    private static Gson gson = new Gson();

    public UserController () {

    }

    public static Object setName (Request req, Response res)
    {
        res.type("application/json");
        AccountModel user, body;

        try {
            user = Auth.getUser(req);
            body = gson.fromJson(req.body(), AccountModel.class);

            if ((body.name == null) || (body.name.length() == 0)) {
                throw new Exception("Name is empty");
            }

            user.name = body.name;
            Sql2oModel.UserConnector.update(user);
            req.session().attribute("user", user);
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }

        return new ResponseModel(1, new AccountResponseModel(user));
    }

}