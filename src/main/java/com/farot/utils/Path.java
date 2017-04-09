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

      }

      public static class User {

        public static String DEFAULT = "/api/user/";

      }

    }

  }

}