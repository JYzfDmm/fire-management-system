package com.fire.management.controller;

import com.fire.management.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping("/weather")
    public ApiResponse<Map<String, Object>> getWeather() {
        Map<String, Object> weather = new HashMap<>();
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        
        String season;
        int avgTemp;
        String condition;
        String icon;

        if (month >= 3 && month <= 5) {
            season = "春季";
            avgTemp = new Random().nextInt(8) + 12;
            condition = "多云转晴";
            icon = "⛅";
        } else if (month >= 6 && month <= 8) {
            season = "夏季";
            avgTemp = new Random().nextInt(8) + 28;
            condition = "晴朗";
            icon = "☀️";
        } else if (month >= 9 && month <= 11) {
            season = "秋季";
            avgTemp = new Random().nextInt(8) + 15;
            condition = "晴间多云";
            icon = "🌤️";
        } else {
            season = "冬季";
            avgTemp = new Random().nextInt(10) - 2;
            condition = "阴天";
            icon = "☁️";
        }

        weather.put("date", today.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日")));
        weather.put("weekday", getWeekday(today));
        weather.put("season", season);
        weather.put("temperature", avgTemp);
        weather.put("temperatureRange", (avgTemp - 5) + "°C ~ " + (avgTemp + 5) + "°C");
        weather.put("condition", condition);
        weather.put("icon", icon);
        weather.put("humidity", new Random().nextInt(30) + 50 + "%");
        weather.put("wind", "东北风 " + (new Random().nextInt(3) + 2) + "级");
        weather.put("airQuality", "良好");

        return ApiResponse.success(weather);
    }

    @GetMapping("/clothing")
    public ApiResponse<Map<String, Object>> getClothingSuggestion() {
        Map<String, Object> clothing = new HashMap<>();
        int month = LocalDate.now().getMonthValue();

        String season;
        String suggestion;
        String uniform;
        String training;
        String caution;
        List<String> tips = new ArrayList<>();

        if (month >= 3 && month <= 5) {
            season = "春季";
            suggestion = "春季气温多变，注意适当增减衣物";
            uniform = "春秋常服、长袖作训服";
            training = "长袖体能训练服、作训帽";
            caution = "早晚温差较大，训练后及时更换湿衣";
            tips.add("春季干燥，注意补充水分");
            tips.add("注意预防感冒，室内保持通风");
            tips.add("执勤时可备薄外套");
        } else if (month >= 6 && month <= 8) {
            season = "夏季";
            suggestion = "夏季高温，注意防暑降温";
            uniform = "夏常服、短袖作训服";
            training = "短袖体能训练服、遮阳帽";
            caution = "高温时段避免高强度训练，严防中暑";
            tips.add("多喝水，常备防暑药品");
            tips.add("训练后不要立即冲凉水澡");
            tips.add("车内温度高，注意车内通风");
        } else if (month >= 9 && month <= 11) {
            season = "秋季";
            suggestion = "秋季转凉，注意保暖防寒";
            uniform = "春秋常服、长袖作训服";
            training = "长袖体能训练服、可加穿薄背心";
            caution = "秋天气候干燥，训练前做好热身";
            tips.add("秋季是训练黄金期，注意科学训练");
            tips.add("早晚凉，出操时注意保暖");
            tips.add("注意秋燥，多吃润燥食物");
        } else {
            season = "冬季";
            suggestion = "冬季严寒，注意防冻保暖";
            uniform = "冬常服、棉衣、棉大衣";
            training = "保暖内衣+作训服、防寒帽";
            caution = "低温环境训练严防冻伤，出警注意防滑";
            tips.add("外出执勤务必穿好防寒装备");
            tips.add("训练前充分热身，防止肌肉拉伤");
            tips.add("宿舍注意保暖，保持适宜温度");
        }

        clothing.put("season", season);
        clothing.put("suggestion", suggestion);
        clothing.put("uniform", uniform);
        clothing.put("training", training);
        clothing.put("caution", caution);
        clothing.put("tips", tips);

        return ApiResponse.success(clothing);
    }

    @GetMapping("/meeting-summary")
    public ApiResponse<Map<String, Object>> getMeetingSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        List<Map<String, Object>> points = new ArrayList<>();
        
        Map<String, Object> p1 = new HashMap<>();
        p1.put("title", "训练工作");
        p1.put("content", "本周训练重点为高层建筑灭火救援实战演练，要求各中队认真组织，确保训练质量，下周进行考核验收。");
        points.add(p1);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("title", "安全管理");
        p2.put("content", "强调车辆出行安全，严格执行车辆派遣制度，严禁酒后驾车、疲劳驾车。各单位开展一次安全隐患排查。");
        points.add(p2);

        Map<String, Object> p3 = new HashMap<>();
        p3.put("title", "装备维护");
        p3.put("content", "各中队务必于本周五前完成随车器材清点与保养工作，确保装备完好率达到100%，随时处于战备状态。");
        points.add(p3);

        Map<String, Object> p4 = new HashMap<>();
        p4.put("title", "政治学习");
        p4.put("content", "组织学习上级文件精神，开展主题教育活动，做好学习笔记，每人撰写一篇心得体会，下周一前上交。");
        points.add(p4);

        Map<String, Object> p5 = new HashMap<>();
        p5.put("title", "后勤保障");
        p5.put("content", "换季物资已到，请各中队按规定领取。食堂加强食品安全管理，严格食品采购验收制度。");
        points.add(p5);

        summary.put("title", "本周二队务会议要点");
        summary.put("date", getLastTuesday());
        summary.put("host", "大队长");
        summary.put("participants", "各中队长、后勤、机关人员");
        summary.put("points", points);

        return ApiResponse.success(summary);
    }

    private String getWeekday(LocalDate date) {
        String[] weekdays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        return weekdays[date.getDayOfWeek().getValue() % 7];
    }

    private String getLastTuesday() {
        LocalDate today = LocalDate.now();
        int daysToSubtract = today.getDayOfWeek().getValue() >= 2 ? 
            today.getDayOfWeek().getValue() - 2 : 5;
        LocalDate lastTuesday = today.minusDays(daysToSubtract);
        return lastTuesday.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
    }
}
