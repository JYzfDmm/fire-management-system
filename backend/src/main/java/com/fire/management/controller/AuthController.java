package com.fire.management.controller;

import com.fire.management.dto.ApiResponse;
import com.fire.management.dto.LoginRequest;
import com.fire.management.dto.LoginResponse;
import com.fire.management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return ApiResponse.success("登录成功", response);
        } catch (Exception e) {
            return ApiResponse.error(401, "账号或密码错误");
        }
    }
}
