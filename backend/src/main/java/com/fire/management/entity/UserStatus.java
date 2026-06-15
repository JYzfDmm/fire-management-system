package com.fire.management.entity;

public enum UserStatus {
    ON_JOB("在职"),
    ON_LEAVE("休假"),
    RESIGNED("离职");

    private final String description;

    UserStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
