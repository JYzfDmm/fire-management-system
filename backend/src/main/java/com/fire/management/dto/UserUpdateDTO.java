package com.fire.management.dto;

import com.fire.management.entity.Gender;
import com.fire.management.entity.Role;
import com.fire.management.entity.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    @NotBlank(message = "姓名不能为空")
    @Size(max = 50, message = "姓名长度不能超过50")
    private String realName;

    @NotNull(message = "角色不能为空")
    private Role role;

    @NotBlank(message = "所属中队/部门不能为空")
    @Size(max = 50, message = "所属中队/部门长度不能超过50")
    private String department;

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1\\d{10}$", message = "手机号格式不正确")
    private String phone;

    @NotNull(message = "状态不能为空")
    private UserStatus status;

    private Gender gender;

    private String emergencyContact;

    private String emergencyPhone;

    @NotNull(message = "入职日期不能为空")
    private LocalDate joinDate;

    private String remark;
}
