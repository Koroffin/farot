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
  public UUID user_id = null;
  public String token = null;
}