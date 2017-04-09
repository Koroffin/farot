package com.farot;

import java.util.HashMap;
import java.util.UUID;

import com.google.gson.Gson;

import static spark.Spark.*;

import com.farot.utils.Path;

import com.farot.controllers.UserController;
import com.farot.controllers.AccountController;

public class App 
{
  private static Gson gson = new Gson();

  private static void enableCORS() {

    options("/*",
      (request, response) -> {

        String accessControlRequestHeaders = request
                .headers("Access-Control-Request-Headers");
        if (accessControlRequestHeaders != null) {
            response.header("Access-Control-Allow-Headers",
                    accessControlRequestHeaders);
        }

        String accessControlRequestMethod = request
                .headers("Access-Control-Request-Method");
        if (accessControlRequestMethod != null) {
            response.header("Access-Control-Allow-Methods",
                    accessControlRequestMethod);
        }

        return "OK";
      });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
  }

  public static void main( String[] args )
  {
    staticFiles.location("/public");

    enableCORS();

    post(Path.Web.api.Account.DEFAULT, (req, res) -> { 
      return AccountController.createAccount(req, res); 
    }, gson::toJson);

    post(Path.Web.api.Account.AUTH, (req, res) -> { 
      return AccountController.auth(req, res); 
    }, gson::toJson);

    get(Path.Web.api.Account.AUTH, (req, res) -> { 
      return AccountController.checkAuth(req, res); 
    }, gson::toJson);

    exception(Exception.class, (e, request, response) -> {
      System.out.println("Got: " + e.getMessage() + " all!"); 
    });
  }

}
