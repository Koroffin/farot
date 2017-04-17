package com.farot.models;

import java.util.UUID;
import java.util.Date;

public class AccountModel {

  public UUID id;
  public Date last_login;
  public Date created_at;
  public Date updated_at;

  public String login;
  public String pass;
  public UUID user_id;
  public String token = null;

  public int gold;
  public int gold_per_minute;
  public int wood;
  public int wood_per_minute;
}