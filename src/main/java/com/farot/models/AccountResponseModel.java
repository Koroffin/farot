package com.farot.models;

import java.util.UUID;
import java.util.Date;

import com.farot.models.AccountModel;

public class AccountResponseModel {

  public UUID id;
  public Date last_login;
  public String token;

  public AccountResponseModel (AccountModel model) {
    this.id = model.id;
    this.last_login = model.last_login;
    this.token = model.token;
  }
}