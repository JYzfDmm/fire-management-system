package com.fire.management.dto;

import com.fire.management.entity.Permission;
import com.fire.management.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
