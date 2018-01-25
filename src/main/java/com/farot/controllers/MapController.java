package com.farot.controllers;

import java.util.List;

import java.lang.Math;

import com.google.gson.Gson;

import spark.Request;
import spark.Response;

import com.farot.models.ResponseModel;
import com.farot.models.AccountModel;
import com.farot.models.ResponseArrayModel;

import com.farot.utils.Sql2oModel;
import com.farot.utils.Auth;

public class MapController {

    private static Gson gson = new Gson();

    public MapController () {

    }
    
    public static Object get (Request req, Response res) {
        res.type("application/json");
        try {
            AccountModel user = Auth.getUser(req);
            return new ResponseArrayModel(1, (List<Object>) (Object) Sql2oModel.MapConnector.get(user.x, user.y));
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }
    }

    public static Object move (Request req, Response res) {
        res.type("application/json");
        AccountModel user, body;

        try {
            user = Auth.getUser(req);
            body = gson.fromJson(req.body(), AccountModel.class);

            if ((Math.abs(user.x - body.x) > 1) || (Math.abs(user.y - body.y) > 1)) {
                throw new Exception("Too long movement");
            }

            List<Object> result = (List<Object>) (Object) Sql2oModel.MapConnector.move(body.x, body.y);
            
            user.x = body.x;
            user.y = body.y;
            Sql2oModel.UserConnector.update(user);
            req.session().attribute("user", user);

            return new ResponseArrayModel(1, result);
        } catch (Exception e) {
            return new ResponseModel(0, e);
        }
    }

}