package com.farot;

public class WebConstants {

    public static String HOME = "/";

    public static class api {

        public static class Account {
            public static String DEFAULT = "/api/account";
            public static String AUTH        = "/api/account/auth";    
            public static String LOGOUT    = "/api/account/logout";    
        }

        public static class User {
            public static String DEFAULT = "/api/user";
            public static String NAME = "/api/user/name";
        }

        public static class Map {
            public static String DEFAULT = "/api/map";
            public static String MOVE = "/api/map/move";
        }

    }

}