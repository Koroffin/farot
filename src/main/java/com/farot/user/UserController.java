package com.farot;

import spark.Request;
import spark.Response;

import com.google.gson.Gson;

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