package com.fire.management.dto;

import com.fire.management.entity.Gender;
import com.fire.management.entity.Permission;
import com.fire.management.entity.Role;
import com.fire.management.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String realName;
    private Role role;
    private String roleDescription;
    private Set<Permission> permissions;
    private Boolean enabled;
    private String department;
    private String phone;
    private UserStatus status;
    private String statusDescription;
    private Gender gender;
    private String genderDescription;
    private String emergencyContact;
    private String emergencyPhone;
    private LocalDate joinDate;
    private String remark;
    private Boolean firstLogin;
}
