package com.fire.management.controller;

import com.fire.management.dto.*;
import com.fire.management.entity.Role;
import com.fire.management.entity.UserStatus;
import com.fire.management.security.JwtUtil;
import com.fire.management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    private String getUsernameFromAuth(String authHeader) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("未授权");
        }
        String token = authHeader.substring(7);
        return jwtUtil.getUsernameFromToken(token);
    }

    @GetMapping("/me")
    public ApiResponse<UserDTO> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            String username = getUsernameFromAuth(authHeader);
            UserDTO user = userService.getCurrentUser(username);
            return ApiResponse.success(user);
        } catch (RuntimeException e) {
            return ApiResponse.error(401, e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ApiResponse.success(users);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<PageResponse<UserDTO>> getUsersPage(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<UserDTO> result = userService.getUsersPage(keyword, role, status, department, page, size);
        return ApiResponse.success(result);
    }

    @GetMapping("/departments")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<List<String>> getAllDepartments() {
        List<String> departments = userService.getAllDepartments();
        return ApiResponse.success(departments);
    }

    @GetMapping("/check-username")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<Boolean> checkUsernameExists(@RequestParam String username) {
        boolean exists = userService.checkUsernameExists(username);
        return ApiResponse.success(exists);
    }

    @GetMapping("/check-phone")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<Boolean> checkPhoneExists(
            @RequestParam String phone,
            @RequestParam(required = false) Long excludeId
    ) {
        boolean exists = userService.checkPhoneExists(phone, excludeId);
        return ApiResponse.success(exists);
    }

    @PostMapping
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<UserDTO> createUser(
            @Valid @RequestBody UserCreateDTO dto,
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        try {
            String operatorUsername = getUsernameFromAuth(authHeader);
            UserDTO user = userService.createUser(dto, operatorUsername);
            return ApiResponse.success("创建成功", user);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO dto,
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        try {
            String operatorUsername = getUsernameFromAuth(authHeader);
            UserDTO user = userService.updateUser(id, dto, operatorUsername);
            return ApiResponse.success("更新成功", user);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        try {
            String operatorUsername = getUsernameFromAuth(authHeader);
            userService.deleteUser(id, operatorUsername);
            return ApiResponse.success("删除成功", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<Void> resetPassword(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        try {
            String operatorUsername = getUsernameFromAuth(authHeader);
            userService.resetPassword(id, operatorUsername);
            return ApiResponse.success("密码已重置为默认值 123456", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @Valid @RequestBody ChangePasswordDTO dto,
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        try {
            String username = getUsernameFromAuth(authHeader);
            userService.changePassword(username, dto);
            return ApiResponse.success("密码修改成功", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/reset-password-by-user")
    public ApiResponse<Void> resetPasswordByUser(
            @Valid @RequestBody ResetPasswordDTO dto,
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        try {
            String username = getUsernameFromAuth(authHeader);
            userService.resetPasswordByUser(username, dto);
            return ApiResponse.success("密码修改成功", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/roles")
    public ApiResponse<List<Map<String, String>>> getRoles() {
        List<Map<String, String>> roles = java.util.Arrays.stream(Role.values())
                .map(r -> Map.of(
                        "value", r.name(),
                        "label", r.getDescription()
                ))
                .toList();
        return ApiResponse.success(roles);
    }

    @GetMapping("/statuses")
    public ApiResponse<List<Map<String, String>>> getStatuses() {
        List<Map<String, String>> statuses = java.util.Arrays.stream(UserStatus.values())
                .map(s -> Map.of(
                        "value", s.name(),
                        "label", s.getDescription()
                ))
                .toList();
        return ApiResponse.success(statuses);
    }
}
