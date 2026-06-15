package com.fire.management.repository;

import com.fire.management.entity.Role;
import com.fire.management.entity.User;
import com.fire.management.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
    boolean existsByPhoneAndIdNot(String phone, Long id);

    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR u.realName LIKE %:keyword% OR u.username LIKE %:keyword%) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:department IS NULL OR :department = '' OR u.department = :department)")
    Page<User> findByFilters(
            @Param("keyword") String keyword,
            @Param("role") Role role,
            @Param("status") UserStatus status,
            @Param("department") String department,
            Pageable pageable
    );

    @Query("SELECT DISTINCT u.department FROM User u WHERE u.department IS NOT NULL AND u.department != '' ORDER BY u.department")
    java.util.List<String> findAllDepartments();
}
