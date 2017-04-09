package com.farot.models;

public class ResponseModel {

  public int success;
  public Object data;

  public ResponseModel (int success, Object data) {
    this.success = success;
    this.data    = data;
  }

  public ResponseModel (int success) {
    this.success = success;
    this.data    = new Object();
  }

}