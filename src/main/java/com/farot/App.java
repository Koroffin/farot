package com.farot;

import java.util.HashMap;
import java.util.UUID;
import java.net.URL;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.charset.Charset;
import java.io.IOException;
import java.io.File;
import java.util.Scanner;
import java.io.InputStream;

import com.google.gson.Gson;

import static spark.Spark.*;

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
            }
        );

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
    }


    public static void main( String[] args )
    {

        staticFiles.location("/public");
        port(80);

        enableCORS();

        before((req, res) -> {
            String path = req.pathInfo();
            if (path.endsWith("/"))
                res.redirect(path.substring(0, path.length() - 1));
        });

        // Site pages
        get("/", "text/html", (req, res) -> IndexController.render());
        get("/login", "text/html", (req, res) -> IndexController.render());
        get("/game", "text/html", (req, res) -> IndexController.render());
        get("/registration", "text/html", (req, res) -> IndexController.render());

        // API routes
        post(WebConstants.api.Account.DEFAULT, (req, res) -> { 
            return AccountController.create(req, res); 
        }, gson::toJson);
        post(WebConstants.api.Account.AUTH, (req, res) -> { 
            System.out.println("Post to auth in router!");
            return AccountController.auth(req, res); 
        }, gson::toJson);
        get(WebConstants.api.Account.AUTH, (req, res) -> { 
            return AccountController.checkAuth(req, res); 
        }, gson::toJson);
        post(WebConstants.api.Account.LOGOUT, (req, res) -> { 
            return AccountController.logout(req, res); 
        }, gson::toJson);

        post(WebConstants.api.User.NAME, (req, res) -> { 
            return UserController.setName(req, res); 
        }, gson::toJson);

        // get(WebConstants.api.Map.DEFAULT, (req, res) -> { 
        //     return MapController.get(req, res); 
        // }, gson::toJson);
        // post(WebConstants.api.Map.MOVE, (req, res) -> { 
        //     return MapController.move(req, res); 
        // }, gson::toJson);

        // exception(Exception.class, (e, request, response) -> {
        //     System.out.println("Got: " + e.getMessage() + " all!"); 
        // });
    }

}