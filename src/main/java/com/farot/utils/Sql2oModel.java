package com.farot.utils;

import org.sql2o.Connection;
import org.sql2o.Sql2o;
import org.sql2o.converters.UUIDConverter;
import org.sql2o.quirks.PostgresQuirks;

import java.util.Date;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

import java.util.concurrent.ThreadLocalRandom;

import com.farot.utils.Path;

import com.farot.models.AccountModel;
import com.farot.models.CoordinateModel;

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
      "(id, gold, gold_per_minute, wood, wood_per_minute, x, y) " +
      "VALUES " +
      "(:id, :gold, :gold_per_minute, :wood, :wood_per_minute, :x, :y)";
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
      "where user_id=:user_id";

    public static void create (AccountModel model) {
      try (Connection conn = sql2o.beginTransaction()) {

        conn.createQuery(CREATE_USER_QUERY)
          .addParameter("id", model.user_id)
          .addParameter("gold", Path.User.default_resources.GOLD)
          .addParameter("gold_per_minute", Path.User.default_resources.GOLD_PER_MINUTE)
          .addParameter("wood", Path.User.default_resources.WOOD)
          .addParameter("wood_per_minute", Path.User.default_resources.WOOD_PER_MINUTE)
          .addParameter("x", Path.User.default_coordinates.X)
          .addParameter("y", Path.User.default_coordinates.Y)
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
          .addParameter("user_id", model.user_id)
          .addParameter("last_login", model.last_login)
          .addParameter("token", model.token)
          .addParameter("updated_at", new Date())
          .executeUpdate();
        conn.commit();
        return;
      }
    }

  }

  public static class User {
    private static String UPDATE_USER_QUERY = 
      "update users set " +
      "name=:name, x=:x, y=:y " +
      "where id=:id";

    public static void update (AccountModel model) {
      try (Connection conn = sql2o.beginTransaction()) {
        conn.createQuery(UPDATE_USER_QUERY)
          .addParameter("id", model.user_id)
          .addParameter("name", model.name)
          .addParameter("x", model.x)
          .addParameter("y", model.y)
          .executeUpdate();
        conn.commit();
        return;
      }
    }
  }

  public static class Map {

    private static String GET_MAP_QUERY = 
      "select * from map where x < :max_x and y < :max_y and x > :min_x and y > :min_y";
    private static String GET_HEX_QUERY = 
      "select * from map where x = :x and y = :y";

    private static CoordinateModel generateHex (int x, int y) {
      return new CoordinateModel(x, y, ThreadLocalRandom.current().nextInt(0, 2));
    }

    private static List<CoordinateModel> generate (int x, int y, List<CoordinateModel> hexs) throws Exception {
      CoordinateModel n, new_hex;
      List<CoordinateModel> new_hexs = new ArrayList<CoordinateModel>();
      int current_x, current_y;
      boolean isnt_found;
      String query = "insert into map (x, y, type, unit_id) values ";

      for (int i=-9; i<10; i++) {
        current_x = x + i;
        for (int j=-9; j<10; j++) {
          current_y = y + j;
          isnt_found = true;
          for (Iterator<CoordinateModel> k = hexs.iterator(); k.hasNext();) {
            n = k.next();
            if ((n.x == current_x) && (n.y == current_y)) {
              isnt_found = false;
              new_hexs.add(n);
              break;
            }
          }

          if (isnt_found) {
            new_hex = generateHex(current_x, current_y);
            new_hexs.add(new_hex);
            query = query + "(" + current_x + ", " + current_y + ", " + new_hex.type + ", null), ";
          }

        }
      }

      query = query.substring(0, query.length() - 2);

      try (Connection conn = sql2o.beginTransaction()) {
        conn.createQuery(query).executeUpdate();
        conn.commit();
      } catch (Exception e) {
        throw e;
      } 

      return new_hexs;      
    }

    public static List<CoordinateModel> get (int x, int y) throws Exception {
      int min_x = x - 10,
        min_y = y - 10,
        max_x = x + 10,
        max_y = y + 10;
      try (Connection conn = sql2o.beginTransaction()) {
        List<CoordinateModel> hexs = conn.createQuery(GET_MAP_QUERY)
          .addParameter("min_y", min_y)
          .addParameter("min_x", min_x)
          .addParameter("max_y", max_y)
          .addParameter("max_x", max_x)
          .executeAndFetch(CoordinateModel.class);

        System.out.println(hexs.size());

        if (hexs.size() < 361) {
          hexs = generate(x, y, hexs);
        }

        return hexs;
      }
    }

    public static List<CoordinateModel> move (int x, int y) throws Exception {
      try (Connection conn = sql2o.beginTransaction()) {
        List<CoordinateModel> hexs = conn.createQuery(GET_HEX_QUERY)
          .addParameter("y", y)
          .addParameter("x", x)
          .executeAndFetch(CoordinateModel.class);

        if (hexs.size() != 0) {
          CoordinateModel hex = hexs.get(0);
          if (hex.type == 0) {
            throw new Exception("Hex is busy");
          }
        }

        return get(x, y);
      }
    }

  }

}