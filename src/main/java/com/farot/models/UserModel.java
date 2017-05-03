package com.farot.models;

import java.util.UUID;
import com.farot.models.AccountModel;
import com.farot.models.CoordinateModel;
import com.farot.models.ResourceModel;

public class UserModel {
  public UUID id;
  public String name;

  public CoordinateModel coordinates;
  public ResourceModel resources;

  public UserModel (AccountModel model) {
    this.id = model.user_id;
    this.name = model.name;
    this.coordinates = new CoordinateModel(model);
    this.resources = new ResourceModel(model);
  }
}