package com.fire.management.entity;

public enum Role {
    PT("普通队员"),
    ZD("中队长"),
    DD("大队长"),
    HQ("后勤"),
    ST("食堂管理员"),
    SYS("系统管理员");

    private final String description;

    Role(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
