-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'System Administrator', '{"all": true}'),
('registrar', 'Registration Officer', '{"applications": ["read", "update", "approve"], "users": ["read", "update"], "reports": ["read"]}'),
('reviewer', 'Application Reviewer', '{"applications": ["read", "review"], "documents": ["verify"]}'),
('user', 'Regular User', '{"applications": ["create", "read_own", "update_own"], "profile": ["read", "update"]}'),
('institution', 'Institution Representative', '{"fellowships": ["create", "read", "update"], "applications": ["read"]}');

-- Insert countries
INSERT INTO countries (code, name_en, name_ar) VALUES
('SAU', 'Saudi Arabia', 'المملكة العربية السعودية'),
('UAE', 'United Arab Emirates', 'الإمارات العربية المتحدة'),
('KWT', 'Kuwait', 'الكويت'),
('QAT', 'Qatar', 'قطر'),
('BHR', 'Bahrain', 'البحرين'),
('OMN', 'Oman', 'عمان'),
('JOR', 'Jordan', 'الأردن'),
('LBN', 'Lebanon', 'لبنان'),
('EGY', 'Egypt', 'مصر'),
('USA', 'United States', 'الولايات المتحدة'),
('GBR', 'United Kingdom', 'المملكة المتحدة'),
('CAN', 'Canada', 'كندا'),
('AUS', 'Australia', 'أستراليا');

-- Insert Saudi cities
INSERT INTO cities (country_id, name_en, name_ar) 
SELECT c.id, city.name_en, city.name_ar
FROM countries c
CROSS JOIN (VALUES
    ('Riyadh', 'الرياض'),
    ('Jeddah', 'جدة'),
    ('Mecca', 'مكة المكرمة'),
    ('Medina', 'المدينة المنورة'),
    ('Dammam', 'الدمام'),
    ('Khobar', 'الخبر'),
    ('Dhahran', 'الظهران'),
    ('Tabuk', 'تبوك'),
    ('Abha', 'أبها'),
    ('Khamis Mushait', 'خميس مشيط'),
    ('Najran', 'نجران'),
    ('Jazan', 'جازان'),
    ('Hail', 'حائل'),
    ('Al Qassim', 'القصيم'),
    ('Taif', 'الطائف')
) AS city(name_en, name_ar)
WHERE c.code = 'SAU';

-- Insert specializations
INSERT INTO specializations (name_en, name_ar, description_en, description_ar) VALUES
('Agricultural Engineering', 'الهندسة الزراعية', 'General agricultural engineering practices', 'ممارسات الهندسة الزراعية العامة'),
('Irrigation and Drainage', 'الري والصرف', 'Water management and irrigation systems', 'إدارة المياه وأنظمة الري'),
('Agricultural Machinery', 'الآلات الزراعية', 'Farm equipment and mechanization', 'المعدات الزراعية والميكنة'),
('Soil and Water Conservation', 'حفظ التربة والمياه', 'Soil conservation and water management', 'حفظ التربة وإدارة المياه'),
('Post-Harvest Technology', 'تقنيات ما بعد الحصاد', 'Food processing and storage systems', 'أنظمة معالجة وتخزين الأغذية'),
('Greenhouse Technology', 'تقنيات البيوت المحمية', 'Protected agriculture systems', 'أنظمة الزراعة المحمية'),
('Precision Agriculture', 'الزراعة الدقيقة', 'Technology-driven farming practices', 'ممارسات الزراعة المدفوعة بالتكنولوجيا'),
('Renewable Energy in Agriculture', 'الطاقة المتجددة في الزراعة', 'Sustainable energy solutions for farming', 'حلول الطاقة المستدامة للزراعة');

-- Insert certification levels
INSERT INTO certification_levels (name_en, name_ar, description_en, description_ar, requirements) VALUES
('Associate Engineer', 'مهندس مساعد', 'Entry-level certification for new graduates', 'شهادة مستوى مبتدئ للخريجين الجدد', '{"education": "bachelor", "experience_years": 0}'),
('Professional Engineer', 'مهندس محترف', 'Mid-level certification for experienced engineers', 'شهادة مستوى متوسط للمهندسين ذوي الخبرة', '{"education": "bachelor", "experience_years": 3}'),
('Senior Engineer', 'مهندس أول', 'Advanced certification for senior engineers', 'شهادة متقدمة للمهندسين الأوائل', '{"education": "bachelor", "experience_years": 7}'),
('Consulting Engineer', 'مهندس استشاري', 'Expert-level certification for consulting work', 'شهادة مستوى خبير للعمل الاستشاري', '{"education": "master", "experience_years": 10}'),
('Fellow Engineer', 'مهندس زميل', 'Highest level certification for distinguished engineers', 'أعلى مستوى شهادة للمهندسين المتميزين', '{"education": "phd", "experience_years": 15}');
