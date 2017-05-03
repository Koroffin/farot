package com.farot.models;

import java.util.List;
import java.util.ArrayList;

public class ResponseArrayModel {

  public int success;
  public List<Object> data;

  public ResponseArrayModel (int success, List<Object> data) {
    this.success = success;
    this.data    = data;
  }

  public ResponseArrayModel (int success) {
    this.success = success;
    this.data    = new ArrayList<Object>();
  }

}