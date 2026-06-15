package com.fire.management.init;

import com.fire.management.entity.*;
import com.fire.management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
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
            int phoneSeq = 1;
            createPtUsers(phoneSeq);
            phoneSeq += 40;
            createZdUsers(phoneSeq);
            phoneSeq += 4;
            createDdUsers(phoneSeq);
            phoneSeq += 2;
            createHqUsers(phoneSeq);
            phoneSeq += 2;
            createStUsers(phoneSeq);
            phoneSeq += 2;
            createSysUser(phoneSeq);
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

    private String getPhone(int seq) {
        return "1" + String.format("%010d", seq);
    }

    private void createPtUsers(int startPhoneSeq) {
        String[] ptNames = {
            "张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十",
            "郑一", "冯二", "陈三", "褚四", "卫五", "蒋六", "沈七", "韩八",
            "杨九", "朱十", "秦一", "尤二", "许三", "何四", "吕五", "施六",
            "张七", "孔八", "曹九", "严十", "华一", "金二", "魏三", "陶四",
            "姜五", "戚六", "谢七", "邹八", "喻九", "柏十", "水一", "窦二"
        };

        String[] departments = {"第一中队", "第二中队", "第三中队", "第四中队"};

        for (int i = 1; i <= 40; i++) {
            int deptIndex = (i - 1) / 10;
            String username = String.format("PT%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("pt"));
            user.setRealName(ptNames[i - 1]);
            user.setRole(Role.PT);
            user.setPermissions(getPtPermissions());
            user.setEnabled(true);
            user.setDepartment(departments[deptIndex]);
            user.setPhone(getPhone(startPhoneSeq + i - 1));
            user.setStatus(UserStatus.ON_JOB);
            user.setGender(Gender.MALE);
            user.setJoinDate(LocalDate.of(2020, 1, 1));
            user.setFirstLogin(true);
            userRepository.save(user);
        }
    }

    private void createZdUsers(int startPhoneSeq) {
        String[] zdNames = {"中队长一", "中队长二", "中队长三", "中队长四"};
        String[] departments = {"第一中队", "第二中队", "第三中队", "第四中队"};
        for (int i = 1; i <= 4; i++) {
            String username = String.format("ZD%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("zdz"));
            user.setRealName(zdNames[i - 1]);
            user.setRole(Role.ZD);
            user.setPermissions(getZdPermissions());
            user.setEnabled(true);
            user.setDepartment(departments[i - 1]);
            user.setPhone(getPhone(startPhoneSeq + i - 1));
            user.setStatus(UserStatus.ON_JOB);
            user.setGender(Gender.MALE);
            user.setJoinDate(LocalDate.of(2020, 1, 1));
            user.setFirstLogin(true);
            userRepository.save(user);
        }
    }

    private void createDdUsers(int startPhoneSeq) {
        String[] ddNames = {"大队长一", "大队长二"};
        String[] departments = {"第一二中队", "第三四中队"};
        for (int i = 1; i <= 2; i++) {
            String username = String.format("DD%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("ddz"));
            user.setRealName(ddNames[i - 1]);
            user.setRole(Role.DD);
            user.setPermissions(getDdPermissions());
            user.setEnabled(true);
            user.setDepartment(departments[i - 1]);
            user.setPhone(getPhone(startPhoneSeq + i - 1));
            user.setStatus(UserStatus.ON_JOB);
            user.setGender(Gender.MALE);
            user.setJoinDate(LocalDate.of(2020, 1, 1));
            user.setFirstLogin(true);
            userRepository.save(user);
        }
    }

    private void createHqUsers(int startPhoneSeq) {
        String[] hqNames = {"后勤一", "后勤二"};
        for (int i = 1; i <= 2; i++) {
            String username = String.format("HQ%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("hq"));
            user.setRealName(hqNames[i - 1]);
            user.setRole(Role.HQ);
            user.setPermissions(getHqPermissions());
            user.setEnabled(true);
            user.setDepartment("后勤部门");
            user.setPhone(getPhone(startPhoneSeq + i - 1));
            user.setStatus(UserStatus.ON_JOB);
            user.setGender(Gender.MALE);
            user.setJoinDate(LocalDate.of(2020, 1, 1));
            user.setFirstLogin(true);
            userRepository.save(user);
        }
    }

    private void createStUsers(int startPhoneSeq) {
        String[] stNames = {"食堂管理一", "食堂管理二"};
        for (int i = 1; i <= 2; i++) {
            String username = String.format("ST%03d", i);
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("st"));
            user.setRealName(stNames[i - 1]);
            user.setRole(Role.ST);
            user.setPermissions(getStPermissions());
            user.setEnabled(true);
            user.setDepartment("后勤部门");
            user.setPhone(getPhone(startPhoneSeq + i - 1));
            user.setStatus(UserStatus.ON_JOB);
            user.setGender(Gender.MALE);
            user.setJoinDate(LocalDate.of(2020, 1, 1));
            user.setFirstLogin(true);
            userRepository.save(user);
        }
    }

    private void createSysUser(int startPhoneSeq) {
        User user = new User();
        user.setUsername("SYS001");
        user.setPassword(passwordEncoder.encode("sys"));
        user.setRealName("系统管理员");
        user.setRole(Role.SYS);
        user.setPermissions(getSysPermissions());
        user.setEnabled(true);
        user.setDepartment("系统管理");
        user.setPhone(getPhone(startPhoneSeq));
        user.setStatus(UserStatus.ON_JOB);
        user.setGender(Gender.MALE);
        user.setJoinDate(LocalDate.of(2020, 1, 1));
        user.setFirstLogin(true);
        userRepository.save(user);
    }
}
