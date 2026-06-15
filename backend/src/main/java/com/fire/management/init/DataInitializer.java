package com.fire.management.init;

import com.fire.management.entity.Permission;
import com.fire.management.entity.Role;
import com.fire.management.entity.User;
import com.fire.management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            createPtUsers();
            createZdUsers();
            createDdUsers();
            createHqUsers();
            createStUsers();
            createSysUser();
            System.out.println("============================================");
            System.out.println("用户数据初始化完成！共创建 " + userRepository.count() + " 个用户");
            System.out.println("普通队员账号: PT001~PT040, 密码: pt");
            System.out.println("中队长账号: ZD001~ZD004, 密码: zdz");
            System.out.println("大队长账号: DD001~DD002, 密码: ddz");
            System.out.println("后勤账号: HQ001~HQ002, 密码: hq");
            System.out.println("食堂管理员账号: ST001~ST002, 密码: st");
            System.out.println("系统管理员账号: SYS001, 密码: sys");
            System.out.println("============================================");
        }
    }

    private Set<Permission> getPtPermissions() {
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.VIEW_INFO);
        permissions.add(Permission.RECEIVE_TASK);
        permissions.add(Permission.APPLY_ITEMS);
        permissions.add(Permission.VIEW_MANUAL);
        return permissions;
    }

    private Set<Permission> getZdPermissions() {
        Set<Permission> permissions = getPtPermissions();
        permissions.add(Permission.MANAGE_TRAINING_TASK);
        permissions.add(Permission.REVIEW_APPLICATION);
        permissions.add(Permission.PUBLISH_MEETING_SUMMARY);
        permissions.add(Permission.MANAGE_ACTIVITY);
        return permissions;
    }

    private Set<Permission> getDdPermissions() {
        return getZdPermissions();
    }

    private Set<Permission> getHqPermissions() {
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.VIEW_INFO);
        permissions.add(Permission.MANAGE_MEALS);
        permissions.add(Permission.MANAGE_INVENTORY);
        return permissions;
    }

    private Set<Permission> getStPermissions() {
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.VIEW_INFO);
        permissions.add(Permission.MANAGE_MEALS);
        return permissions;
    }

    private Set<Permission> getSysPermissions() {
        Set<Permission> permissions = new HashSet<>();
        for (Permission p : Permission.values()) {
            permissions.add(p);
        }
        return permissions;
    }

    private void createPtUsers() {
        String[] ptNames = {
            "张伟", "王芳", "李强", "刘洋", "陈静", "杨帆", "赵磊", "黄敏",
            "周杰", "吴刚", "徐丽", "孙浩", "马超", "朱琳", "胡军", "郭鹏",
            "何勇", "高飞", "林峰", "梁宇", "宋涛", "谢婷", "唐亮", "韩雪",
            "冯斌", "董明", "萧然", "程辉", "曹阳", "袁野", "邓超", "许文",
            "傅强", "沈磊", "曾翔", "彭勃", "吕良", "苏伟", "蒋磊", "蔡鹏"
        };

        for (int i = 1; i <= 40; i++) {
            String username = String.format("PT%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("pt"));
            user.setRealName(ptNames[i - 1]);
            user.setRole(Role.PT);
            user.setPermissions(getPtPermissions());
            user.setEnabled(true);
            userRepository.save(user);
        }
    }

    private void createZdUsers() {
        String[] zdNames = {"中队长甲", "中队长乙", "中队长丙", "中队长丁"};
        for (int i = 1; i <= 4; i++) {
            String username = String.format("ZD%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("zdz"));
            user.setRealName(zdNames[i - 1]);
            user.setRole(Role.ZD);
            user.setPermissions(getZdPermissions());
            user.setEnabled(true);
            userRepository.save(user);
        }
    }

    private void createDdUsers() {
        String[] ddNames = {"大队长甲", "大队长乙"};
        for (int i = 1; i <= 2; i++) {
            String username = String.format("DD%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("ddz"));
            user.setRealName(ddNames[i - 1]);
            user.setRole(Role.DD);
            user.setPermissions(getDdPermissions());
            user.setEnabled(true);
            userRepository.save(user);
        }
    }

    private void createHqUsers() {
        String[] hqNames = {"后勤甲", "后勤乙"};
        for (int i = 1; i <= 2; i++) {
            String username = String.format("HQ%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("hq"));
            user.setRealName(hqNames[i - 1]);
            user.setRole(Role.HQ);
            user.setPermissions(getHqPermissions());
            user.setEnabled(true);
            userRepository.save(user);
        }
    }

    private void createStUsers() {
        String[] stNames = {"食堂管理员甲", "食堂管理员乙"};
        for (int i = 1; i <= 2; i++) {
            String username = String.format("ST%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("st"));
            user.setRealName(stNames[i - 1]);
            user.setRole(Role.ST);
            user.setPermissions(getStPermissions());
            user.setEnabled(true);
            userRepository.save(user);
        }
    }

    private void createSysUser() {
        User user = new User();
        user.setUsername("SYS001");
        user.setPassword(passwordEncoder.encode("sys"));
        user.setRealName("系统管理员");
        user.setRole(Role.SYS);
        user.setPermissions(getSysPermissions());
        user.setEnabled(true);
        userRepository.save(user);
    }
}
