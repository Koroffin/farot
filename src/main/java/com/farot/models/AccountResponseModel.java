package com.farot.models;

import java.util.UUID;
import java.util.Date;

import com.farot.models.AccountModel;
import com.farot.models.UserModel;

public class AccountResponseModel {

    public Date last_login;
    public String token;
    public UserModel user;

    public AccountResponseModel (AccountModel model) {
        this.last_login = model.last_login;
        this.token = model.token;
        this.user = new UserModel(model);
    }
}