package com.farot.models;

import java.util.UUID;
import com.farot.models.AccountModel;

public class UserModel {
  public UUID id;
  public int gold;
  public int gold_per_minute;
  public int wood;
  public int wood_per_minute;

  public UserModel (AccountModel model) {
    this.id = model.user_id;
    this.gold = model.gold;
    this.wood = model.wood;
    this.gold_per_minute = model.gold_per_minute;
    this.wood_per_minute = model.wood_per_minute;
  }
}