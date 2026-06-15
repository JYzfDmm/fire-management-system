package com.fire.management.entity;

public enum Permission {
    VIEW_INFO("查看信息"),
    RECEIVE_TASK("接收任务"),
    APPLY_ITEMS("申领物品"),
    VIEW_MANUAL("查看手册"),
    MANAGE_TRAINING_TASK("发布与管理训练任务"),
    REVIEW_APPLICATION("审核申领"),
    PUBLISH_MEETING_SUMMARY("发布会议总结"),
    MANAGE_ACTIVITY("管理活动内容"),
    MANAGE_MEALS("管理三餐公示"),
    MANAGE_INVENTORY("管理日常用品库存与发放"),
    USER_MANAGEMENT("用户管理"),
    PERMISSION_CONFIG("权限配置");

    private final String description;

    Permission(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
