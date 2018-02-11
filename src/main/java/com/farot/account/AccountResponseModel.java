package com.farot;

import java.util.UUID;
import java.util.Date;

public class AccountResponseModel {

    public Date last_login;
    public String token;
    public UserModel user;

    public AccountResponseModel (AccountModel model) {
        last_login = model.last_login;
        token = model.token;
        user = new UserModel(model);
    }
}