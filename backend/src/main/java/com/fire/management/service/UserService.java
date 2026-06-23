package com.fire.management.service;

import com.fire.management.dto.*;
import com.fire.management.entity.*;
import com.fire.management.repository.UserRepository;
import com.fire.management.security.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (user.getStatus() == UserStatus.RESIGNED) {
            throw new RuntimeException("该用户已离职，无法登录");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRealName(),
                user.getRole(),
                user.getRole().getDescription(),
                user.getPermissions(),
                user.getFirstLogin()
        );
    }

    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PageResponse<UserDTO> getUsersPage(String keyword, Role role, UserStatus status,
                                               String department, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "username"));
        Page<User> userPage = userRepository.findByFilters(keyword, role, status, department, pageable);

        List<UserDTO> content = userPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.getNumber(),
                userPage.getSize()
        );
    }

    public List<String> getAllDepartments() {
        return userRepository.findAllDepartments();
    }

    @Transactional
    public UserDTO createUser(UserCreateDTO dto, String operatorUsername) {
        User operator = userRepository.findByUsername(operatorUsername)
                .orElseThrow(() -> new RuntimeException("操作人不存在"));

        if (operator.getRole() != Role.SYS) {
            throw new RuntimeException("只有系统管理员可以创建用户");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("工号已存在");
        }

        if (userRepository.existsByPhone(dto.getPhone())) {
            throw new RuntimeException("手机号已存在");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRealName(dto.getRealName());
        user.setRole(dto.getRole());
        user.setDepartment(dto.getDepartment());
        user.setPhone(dto.getPhone());
        user.setStatus(dto.getStatus());
        user.setGender(dto.getGender());
        user.setEmergencyContact(dto.getEmergencyContact());
        user.setEmergencyPhone(dto.getEmergencyPhone());
        user.setJoinDate(dto.getJoinDate());
        user.setRemark(dto.getRemark());
        user.setEnabled(true);
        user.setFirstLogin(true);
        user.setPermissions(getPermissionsByRole(dto.getRole()));

        user = userRepository.save(user);
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO dto, String operatorUsername) {
        User operator = userRepository.findByUsername(operatorUsername)
                .orElseThrow(() -> new RuntimeException("操作人不存在"));

        if (operator.getRole() != Role.SYS) {
            throw new RuntimeException("只有系统管理员可以编辑用户");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (user.getRole() == Role.SYS && dto.getRole() != Role.SYS) {
            throw new RuntimeException("系统管理员不可被降级");
        }

        if (userRepository.existsByPhoneAndIdNot(dto.getPhone(), id)) {
            throw new RuntimeException("手机号已存在");
        }

        user.setRealName(dto.getRealName());
        user.setRole(dto.getRole());
        user.setDepartment(dto.getDepartment());
        user.setPhone(dto.getPhone());
        user.setStatus(dto.getStatus());
        user.setGender(dto.getGender());
        user.setEmergencyContact(dto.getEmergencyContact());
        user.setEmergencyPhone(dto.getEmergencyPhone());
        user.setJoinDate(dto.getJoinDate());
        user.setRemark(dto.getRemark());
        user.getPermissions().clear();
        user.getPermissions().addAll(getPermissionsByRole(dto.getRole()));

        if (dto.getStatus() == UserStatus.RESIGNED) {
            user.setEnabled(false);
        } else {
            user.setEnabled(true);
        }

        user = userRepository.save(user);
        return convertToDTO(user);
    }

    @Transactional
    public void deleteUser(Long id, String operatorUsername) {
        User operator = userRepository.findByUsername(operatorUsername)
                .orElseThrow(() -> new RuntimeException("操作人不存在"));

        if (operator.getRole() != Role.SYS) {
            throw new RuntimeException("只有系统管理员可以删除用户");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (user.getRole() == Role.SYS) {
            throw new RuntimeException("系统管理员不可被删除");
        }

        if (operator.getId().equals(user.getId())) {
            throw new RuntimeException("不可删除自己的账号");
        }

        user.setStatus(UserStatus.RESIGNED);
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Transactional
    public void resetPassword(Long id, String operatorUsername) {
        User operator = userRepository.findByUsername(operatorUsername)
                .orElseThrow(() -> new RuntimeException("操作人不存在"));

        if (operator.getRole() != Role.SYS) {
            throw new RuntimeException("只有系统管理员可以重置密码");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setPassword(passwordEncoder.encode("123456"));
        user.setFirstLogin(true);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(String username, ChangePasswordDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("两次输入的新密码不一致");
        }

        if (dto.getOldPassword().equals(dto.getNewPassword())) {
            throw new RuntimeException("新密码不能与原密码相同");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setFirstLogin(false);
        userRepository.save(user);
    }

    @Transactional
    public void resetPasswordByUser(String username, ResetPasswordDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("两次输入的新密码不一致");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setFirstLogin(false);
        userRepository.save(user);
    }

    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean checkPhoneExists(String phone, Long excludeId) {
        if (excludeId != null) {
            return userRepository.existsByPhoneAndIdNot(phone, excludeId);
        }
        return userRepository.existsByPhone(phone);
    }

    private Set<Permission> getPermissionsByRole(Role role) {
        return switch (role) {
            case PT -> getPtPermissions();
            case ZD -> getZdPermissions();
            case DD -> getDdPermissions();
            case HQ -> getHqPermissions();
            case ST -> getStPermissions();
            case SYS -> getSysPermissions();
        };
    }

    private Set<Permission> getPtPermissions() {
        return Set.of(
                Permission.VIEW_INFO,
                Permission.RECEIVE_TASK,
                Permission.APPLY_ITEMS,
                Permission.VIEW_MANUAL
        );
    }

    private Set<Permission> getZdPermissions() {
        return Set.of(
                Permission.VIEW_INFO,
                Permission.RECEIVE_TASK,
                Permission.APPLY_ITEMS,
                Permission.VIEW_MANUAL,
                Permission.MANAGE_TRAINING_TASK,
                Permission.REVIEW_APPLICATION,
                Permission.PUBLISH_MEETING_SUMMARY,
                Permission.MANAGE_ACTIVITY
        );
    }

    private Set<Permission> getDdPermissions() {
        return getZdPermissions();
    }

    private Set<Permission> getHqPermissions() {
        return Set.of(
                Permission.VIEW_INFO,
                Permission.MANAGE_MEALS,
                Permission.MANAGE_INVENTORY
        );
    }

    private Set<Permission> getStPermissions() {
        return Set.of(
                Permission.VIEW_INFO,
                Permission.MANAGE_MEALS
        );
    }

    private Set<Permission> getSysPermissions() {
        return Set.of(Permission.values());
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRealName(user.getRealName());
        dto.setRole(user.getRole());
        dto.setRoleDescription(user.getRole().getDescription());
        dto.setPermissions(user.getPermissions());
        dto.setEnabled(user.getEnabled());
        dto.setDepartment(user.getDepartment());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setStatusDescription(user.getStatus() != null ? user.getStatus().getDescription() : null);
        dto.setGender(user.getGender());
        dto.setGenderDescription(user.getGender() != null ? user.getGender().getDescription() : null);
        dto.setEmergencyContact(user.getEmergencyContact());
        dto.setEmergencyPhone(user.getEmergencyPhone());
        dto.setJoinDate(user.getJoinDate());
        dto.setRemark(user.getRemark());
        dto.setFirstLogin(user.getFirstLogin());
        return dto;
    }
}
