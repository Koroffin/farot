package com.farot.models;

import java.util.UUID;
import com.farot.models.AccountModel;

public class CoordinateModel {
    public int x;
    public int y;
    public int type;
    public UUID unit_id;

    public CoordinateModel (AccountModel model) {
        this.x = model.x;
        this.y = model.y;
    }

    public CoordinateModel (int x, int y, int type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}