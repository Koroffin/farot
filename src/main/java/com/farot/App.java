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

import static spark.Spark.*;

public class App 
{

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
        new IndexController();

        // API routes
        new AccountController();
        new UserController();

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