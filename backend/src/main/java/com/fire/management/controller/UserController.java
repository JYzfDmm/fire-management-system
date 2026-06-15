package com.fire.management.controller;

import com.fire.management.dto.ApiResponse;
import com.fire.management.dto.UserDTO;
import com.fire.management.security.JwtUtil;
import com.fire.management.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/me")
    public ApiResponse<UserDTO> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            return ApiResponse.error(401, "未授权");
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);
        UserDTO user = userService.getCurrentUser(username);
        return ApiResponse.success(user);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('SYS')")
    public ApiResponse<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ApiResponse.success(users);
    }
}
