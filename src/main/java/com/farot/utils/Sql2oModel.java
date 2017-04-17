package com.farot.utils;

import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.converters.UUIDConverter;
import org.sql2o.quirks.PostgresQuirks;

import java.util.Date;
import java.util.UUID;
import java.util.List;

import com.farot.utils.Path;

import com.farot.models.AccountModel;

public class Sql2oModel {

  private static String DB_PATH = 
    "jdbc:postgresql://" + Path.Database.HOST + ":" + Path.Database.PORT + "/" + Path.Database.DATABASE;
  private static Sql2o sql2o = new Sql2o(DB_PATH, Path.Database.USER, Path.Database.PASSWORD, new PostgresQuirks() {
    {
      // make sure we use default UUID converter.
      converters.put(UUID.class, new UUIDConverter());
    }
  });

  public static class Account {
    private static String CREATE_ACCOUNT_QUERY = 
      "insert into accounts" +
      "(id, login, pass, last_login, created_at, updated_at, user_id, token) " +
      "VALUES " +
      "(:id, :login, :pass, :last_login, :created_at, :updated_at, :user_id, :token)";
    private static String CREATE_USER_QUERY = 
      "insert into users" +
      "(id, gold, gold_per_minute, wood, wood_per_minute) " +
      "VALUES " +
      "(:id, :gold, :gold_per_minute, :wood, :wood_per_minute)";
    private static String GET_BY_LOGIN_QUERY = 
      "select * from accounts " +
      "inner join users " +
      "on accounts.user_id = users.id " +
      "where accounts.login=:login";
    private static String GET_BY_TOKEN_QUERY = 
      "select * from accounts " +
      "inner join users " +
      "on accounts.user_id = users.id " +
      "where accounts.token=:token";
    private static String UPDATE_ACCOUNT_QUERY = 
      "update accounts set " +
      "last_login=:last_login, token=:token, updated_at=:updated_at " +
      "where id=:id";

    public static void create (AccountModel model) {
      try (Connection conn = sql2o.beginTransaction()) {

        conn.createQuery(CREATE_USER_QUERY)
          .addParameter("id", model.user_id)
          .addParameter("gold", Path.User.default_resources.GOLD)
          .addParameter("gold_per_minute", Path.User.default_resources.GOLD_PER_MINUTE)
          .addParameter("wood", Path.User.default_resources.WOOD)
          .addParameter("wood_per_minute", Path.User.default_resources.WOOD_PER_MINUTE)
          .executeUpdate();

        conn.createQuery(CREATE_ACCOUNT_QUERY)
          .addParameter("id", model.id)
          .addParameter("login", model.login)
          .addParameter("pass", model.pass)
          .addParameter("last_login", model.last_login)
          .addParameter("user_id", model.user_id)
          .addParameter("token", model.token)
          .addParameter("created_at", new Date())
          .addParameter("updated_at", new Date())
          .executeUpdate();

        conn.commit();
        return;
      }
    }

    public static List<AccountModel> getByLogin (String login) {
      try (Connection conn = sql2o.beginTransaction()) {
        return conn.createQuery(GET_BY_LOGIN_QUERY)
          .addParameter("login", login)
          .executeAndFetch(AccountModel.class);
      }      
    }

    public static List<AccountModel> getByToken (String token) {
      try (Connection conn = sql2o.beginTransaction()) {
        return conn.createQuery(GET_BY_TOKEN_QUERY)
          .addParameter("token", token)
          .executeAndFetch(AccountModel.class);
      }
    }

    public static void update (AccountModel model) {
      try (Connection conn = sql2o.beginTransaction()) {
        conn.createQuery(UPDATE_ACCOUNT_QUERY)
          .addParameter("id", model.id)
          .addParameter("last_login", model.last_login)
          .addParameter("token", model.token)
          .addParameter("updated_at", new Date())
          .executeUpdate();
        conn.commit();
        return;
      }
    }

  }

}