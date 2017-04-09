package com.farot.controllers;

import spark.Request;
import spark.Response;

import com.farot.models.ResponseModel;

public class UserController {

  public UserController () {

  }
  
  public static Object checkAuth (Request req, Response res) {
    res.type("application/json");
    return new ResponseModel(1, new Object());
  }

}