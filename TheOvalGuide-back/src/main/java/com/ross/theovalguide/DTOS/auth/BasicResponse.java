package com.ross.theovalguide.DTOS.auth;

public record BasicResponse(boolean ok) {
    public static final BasicResponse OK = new BasicResponse(true);
}
