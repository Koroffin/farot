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

  private static Sql2o sql2o = new Sql2o("jdbc:postgresql://" + Path.Database.HOST + ":" + Path.Database.PORT + "/" + Path.Database.DATABASE,
      Path.Database.USER, Path.Database.PASSWORD, new PostgresQuirks() {
    {
      // make sure we use default UUID converter.
      converters.put(UUID.class, new UUIDConverter());
    }
  });

  public static class Account {

    public static void create (AccountModel model) {
      try (Connection conn = sql2o.beginTransaction()) {
        conn.createQuery("insert into accounts(id, login, pass, last_login, created_at, updated_at, user_id, token) VALUES (:id, :login, :pass, :last_login, :created_at, :updated_at, :user_id, :token)")
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
        return conn.createQuery("select * from accounts where login=:login")
          .addParameter("login", login)
          .executeAndFetch(AccountModel.class);
      }      
    }

    public static List<AccountModel> getByToken (String token) {
      try (Connection conn = sql2o.beginTransaction()) {
        return conn.createQuery("select * from accounts where token=:token")
          .addParameter("token", token)
          .executeAndFetch(AccountModel.class);
      }
    }

    public static void update (AccountModel model) {
      try (Connection conn = sql2o.beginTransaction()) {
        conn.createQuery("update accounts set last_login=:last_login, user_id=:user_id, token=:token, updated_at=:updated_at where id=:id")
          .addParameter("id", model.id)
          .addParameter("last_login", model.last_login)
          .addParameter("user_id", model.user_id)
          .addParameter("token", model.token)
          .addParameter("updated_at", new Date())
          .executeUpdate();
        conn.commit();
        return;
      }
    }

  }

}