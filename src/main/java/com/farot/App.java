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

  public static void main( String[] args )
  {
    staticFiles.location("/public");

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
