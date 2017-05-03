package com.farot.models;

import com.farot.models.AccountModel;

public class ResourceModel {
  public int gold;
  public int gold_per_minute;
  public int wood;
  public int wood_per_minute;

  public ResourceModel (AccountModel model) {
    this.gold = model.gold;
    this.wood = model.wood;
    this.gold_per_minute = model.gold_per_minute;
    this.wood_per_minute = model.wood_per_minute;
  }
}