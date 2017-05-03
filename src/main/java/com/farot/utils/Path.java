package com.farot.utils;

public class Path {

  public Path() {

  }

  public static class Templates {

    public static String INDEX = "index";
    
  }

  public static class Database {

    public static String HOST = "localhost";
    public static String PORT = "5432";
    public static String DATABASE = "farot";
    public static String USER = "postgres";
    public static String PASSWORD = "as210100";

  }
  
  public static class Web {

    public static String HOME = "/";
    
    public static class api {

      public static class Account {

        public static String DEFAULT = "/api/account/";

        public static String AUTH    = "/api/account/auth/";  

        public static String LOGOUT  = "/api/account/logout/";  

      }

      public static class User {

        public static String DEFAULT = "/api/user/";

        public static String NAME = "/api/user/name/";

      }

      public static class Map {
        
        public static String DEFAULT = "/api/map/";

        public static String MOVE = "/api/map/move/";

      }

    }

  }

  public static class User {

    public static class default_resources {

      public static int GOLD = 100;
      public static int GOLD_PER_MINUTE = 1;

      public static int WOOD = 5;
      public static int WOOD_PER_MINUTE = 0;
    
    }

    public static class default_coordinates {
      public static int X = 0;
      public static int Y = 0;
    }

  }

}