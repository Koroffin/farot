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

import com.farot.constants.WebConstants;

import com.farot.controllers.UserController;
import com.farot.controllers.AccountController;
import com.farot.controllers.MapController;

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

    public static URL getResource(String resourceName) {
        URL url = Thread.currentThread().getContextClassLoader().getResource(resourceName);

        if (url == null) {
            ClassLoader cl = App.class.getClass().getClassLoader();

            if (cl != null) {
                url = cl.getResource(resourceName);
            }
        }

        if ((url == null) && (resourceName != null) && ((resourceName.length() == 0) || (resourceName.charAt(0) != '/'))) { 
            return getResource('/' + resourceName);
        }

        return url;
    }
    public static InputStream getResourceAsStream(String resourceName) {
        URL url = getResource(resourceName);

        try {
            return (url != null) ? url.openStream() : null;
        } catch (IOException e) {
            return null;
        }
    }

    private static String renderIndex() {
        StringBuilder result = new StringBuilder("");

        //Get file from resources folder
        InputStream is = getResourceAsStream("public/index.html");

        try (Scanner scanner = new Scanner(is)) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                result.append(line).append("\n");
            }

            scanner.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result.toString();
    }

    public static void main( String[] args )
    {
        String indexPage = renderIndex();

        staticFiles.location("/public");
        port(80);

        enableCORS();

        before((req, res) -> {
            String path = req.pathInfo();
            if (path.endsWith("/"))
                res.redirect(path.substring(0, path.length() - 1));
        });

        // Site pages
        get("/", "text/html", (req, res) -> indexPage);
        get("/login", "text/html", (req, res) -> indexPage);
        get("/game", "text/html", (req, res) -> indexPage);
        get("/registration", "text/html", (req, res) -> indexPage);

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

        get(WebConstants.api.Map.DEFAULT, (req, res) -> { 
            return MapController.get(req, res); 
        }, gson::toJson);
        post(WebConstants.api.Map.MOVE, (req, res) -> { 
            return MapController.move(req, res); 
        }, gson::toJson);

        exception(Exception.class, (e, request, response) -> {
            System.out.println("Got: " + e.getMessage() + " all!"); 
        });
    }

}