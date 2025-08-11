// ========== تهيئة الصفحة ==========
document.addEventListener("DOMContentLoaded", function() {
    // تحميل البيانات عند بدء التشغيل
    loadAdminData();
    
    // إعداد التنقل بين الأقسام
    setupAdminNavigation();
    
    // إعداد النماذج
    setupAdminForms();
    
    // إعداد الأزرار
    document.getElementById("logoutBtn").addEventListener("click", logoutAdmin);
    
    // إعداد تغيير نوع الاختبار
    document.getElementById("testType").addEventListener("change", updateTestFormFields);
});

// ========== الدوال الرئيسية ==========
function loadAdminData() {
    // هنا سيتم جلب البيانات من الخادم أو localStorage
    // هذا مثال للبيانات الوهمية
    const stats = {
        totalStudents: 125,
        advancedStudents: 42,
        monthlyTests: 87,
        avgProgress: "76%"
    };
    
    // عرض الإحصائيات
    document.getElementById("totalStudents").textContent = stats.totalStudents;
    document.getElementById("advancedStudents").textContent = stats.advancedStudents;
    document.getElementById("monthlyTests").textContent = stats.monthlyTests;
    document.getElementById("avgProgress").textContent = stats.avgProgress;
    
    // تحميل قائمة الطلاب (مثال)
    loadStudentsList();
    
    // تحميل قائمة الاختبارات (مثال)
    loadTestsLists();
}

function setupAdminNavigation() {
    const navLinks = document.querySelectorAll(".admin-nav a[data-section]");
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            
            // إزالة النشط من جميع الروابط
            navLinks.forEach(l => l.classList.remove("active"));
            
            // إضافة النشط للرابط المحدد
            this.classList.add("active");
            
            // إخفاء جميع الأقسام
            document.querySelectorAll(".admin-section").forEach(section => {
                section.classList.remove("active");
            });
            
            // عرض القسم المحدد
            const sectionId = this.getAttribute("data-section");
            document.getElementById(sectionId).classList.add("active");
        });
    });
}

function setupAdminForms() {
    // نموذج إضافة طالب
    document.getElementById("addStudentForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const studentData = {
            name: document.getElementById("studentName").value,
            id: document.getElementById("studentId").value,
            level: document.getElementById("studentLevel").value,
            image: document.getElementById("studentImage").value || "default.jpg",
            progress: 0,
            quranTests: [],
            tajweedTests: [],
            lessonTests: []
        };
        
        // هنا سيتم إرسال البيانات للخادم
        console.log("بيانات الطالب الجديد:", studentData);
        alert("تمت إضافة الطالب بنجاح!");
        this.reset();
        
        // تحديث قائمة الطلاب
        loadStudentsList();
    });
    
    // نموذج إضافة اختبار
    document.getElementById("addTestForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const testType = document.getElementById("testType").value;
        let testData = {};
        
        if (testType === "quran") {
            testData = {
                part: document.getElementById("quranPart").value,
                memorization: document.getElementById("memorizationScore").value,
                recitation: document.getElementById("recitationScore").value,
                date: document.getElementById("testDate").value,
                studentId: document.getElementById("testStudent").value,
                details: {
                    notes: document.getElementById("testNotes").value
                }
            };
        } else if (testType === "tajweed") {
            testData = {
                test: document.getElementById("tajweedTest").value,
                result: document.getElementById("tajweedScore").value,
                evaluation: document.getElementById("tajweedEvaluation").value,
                date: document.getElementById("testDate").value,
                studentId: document.getElementById("testStudent").value
            };
        } else {
            testData = {
                lesson: document.getElementById("lessonName").value,
                result: document.getElementById("lessonScore").value,
                evaluation: document.getElementById("lessonEvaluation").value,
                date: document.getElementById("testDate").value,
                studentId: document.getElementById("testStudent").value
            };
        }
        
        // هنا سيتم إرسال البيانات للخادم
        console.log(`بيانات اختبار ${testType} الجديد:`, testData);
        alert("تمت إضافة الاختبار بنجاح!");
        this.reset();
        
        // تحديث قائمة الاختبارات
        loadTestsLists();
    });
    
    // زر إنشاء التقرير
    document.getElementById("generateReport").addEventListener("click", function() {
        const studentId = document.getElementById("reportStudent").value;
        const reportType = document.getElementById("reportType").value;
        
        // هنا سيتم إنشاء التقرير
        console.log(`إنشاء تقرير ${reportType} للطالب ${studentId || "جميع الطلاب"}`);
        alert("تم إنشاء التقرير بنجاح!");
        
        // عرض معاينة التقرير
        document.getElementById("reportPreview").innerHTML = `
            <div class="card">
                <h4>معاينة التقرير</h4>
                <p>هذه معاينة لتقرير ${reportType} ل${studentId ? "طالب معين" : "جميع الطلاب"}</p>
                <p>سيتم هنا عرض البيانات الفعلية عند التطبيق الكامل</p>
            </div>
        `;
    });
}

function updateTestFormFields() {
    const testType = document.getElementById("testType").value;
    const container = document.getElementById("testDetailsContainer");
    
    let html = '';
    
    // حقول مشتركة
    html += `
        <div class="form-group">
            <label for="testStudent">الطالب</label>
            <select id="testStudent" class="form-control" required>
                <option value="">اختر الطالب</option>
                <!-- سيتم ملؤها بالبيانات الفعلية -->
                <option value="1">أحمد محمد</option>
                <option value="2">خالد عبدالله</option>
                <option value="3">سارة علي</option>
            </select>
        </div>
        <div class="form-group">
            <label for="testDate">تاريخ الاختبار</label>
            <input type="date" id="testDate" class="form-control" required>
        </div>
    `;
    
    // حقول خاصة بنوع الاختبار
    if (testType === "quran") {
        html += `
            <div class="form-group">
                <label for="quranPart">جزء القرآن</label>
                <input type="text" id="quranPart" class="form-control" placeholder="مثال: جزء عم" required>
            </div>
            <div class="form-group">
                <label for="memorizationScore">درجة الحفظ (0-100)</label>
                <input type="number" id="memorizationScore" class="form-control" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="recitationScore">درجة التلاوة (0-100)</label>
                <input type="number" id="recitationScore" class="form-control" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="testNotes">ملاحظات المعلم</label>
                <textarea id="testNotes" class="form-control" rows="3"></textarea>
            </div>
        `;
    } else if (testType === "tajweed") {
        html += `
            <div class="form-group">
                <label for="tajweedTest">اسم اختبار التجويد</label>
                <input type="text" id="tajweedTest" class="form-control" placeholder="مثال: أحكام النون الساكنة" required>
            </div>
            <div class="form-group">
                <label for="tajweedScore">النتيجة (0-100)</label>
                <input type="number" id="tajweedScore" class="form-control" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="tajweedEvaluation">تقييم الأداء</label>
                <textarea id="tajweedEvaluation" class="form-control" rows="3" required></textarea>
            </div>
        `;
    } else {
        html += `
            <div class="form-group">
                <label for="lessonName">اسم الدرس</label>
                <input type="text" id="lessonName" class="form-control" placeholder="مثال: أحكام المدود" required>
            </div>
            <div class="form-group">
                <label for="lessonScore">النتيجة (0-100)</label>
                <input type="number" id="lessonScore" class="form-control" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label for="lessonEvaluation">تقييم الأداء</label>
                <textarea id="lessonEvaluation" class="form-control" rows="3" required></textarea>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function loadStudentsList() {
    // هذا مثال للبيانات الوهمية
    const students = [
        { id: "101", name: "أحمد محمد", level: "متقدم", image: "student1.jpg", progress: 85 },
        { id: "102", name: "خالد عبدالله", level: "متوسط", image: "student2.jpg", progress: 65 },
        { id: "103", name: "سارة علي", level: "مبتدئ", image: "student3.jpg", progress: 30 }
    ];
    
    const tbody = document.getElementById("studentsList");
    tbody.innerHTML = "";
    
    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${student.image}" alt="${student.name}" width="40" height="40" style="border-radius:50%"></td>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.level}</td>
            <td>
                <div class="progress-bar" style="width:100%; height:10px; background:#eee">
                    <div style="width:${student.progress}%; height:100%; background:var(--primary-color)"></div>
                </div>
                <small>${student.progress}%</small>
            </td>
            <td class="actions">
                <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                <button class="btn btn-primary btn-sm"><i class="fas fa-eye"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // تحديث قائمة الطلاب في قسم التقارير
    const reportSelect = document.getElementById("reportStudent");
    reportSelect.innerHTML = '<option value="">جميع الطلاب</option>';
    students.forEach(student => {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = student.name;
        reportSelect.appendChild(option);
    });
}

function loadTestsLists() {
    // هذا مثال للبيانات الوهمية
    const quranTests = [
        { part: "جزء عم", memorization: 90, recitation: 85, date: "2023-05-15", studentId: "101", studentName: "أحمد محمد" },
        { part: "جزء تبارك", memorization: 80, recitation: 75, date: "2023-06-02", studentId: "102", studentName: "خالد عبدالله" }
    ];
    
    const tajweedTests = [
        { test: "أحكام النون الساكنة", result: 95, evaluation: "ممتاز", date: "2023-05-20", studentId: "101", studentName: "أحمد محمد" },
        { test: "أحكام الميم الساكنة", result: 70, evaluation: "جيد", date: "2023-06-05", studentId: "103", studentName: "سارة علي" }
    ];
    
    const lessonTests = [
        { lesson: "أحكام المدود", result: 85, evaluation: "جيد جداً", date: "2023-05-25", studentId: "101", studentName: "أحمد محمد" },
        { lesson: "صفات الحروف", result: 65, evaluation: "مقبول", date: "2023-06-10", studentId: "102", studentName: "خالد عبدالله" }
    ];
    
    // ملء اختبارات القرآن
    const quranTbody = document.getElementById("quranTestsList");
    quranTbody.innerHTML = "";
    quranTests.forEach(test => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${test.part}</td>
            <td><span class="score-badge ${getScoreClass(test.memorization)}">${test.memorization}</span></td>
            <td><span class="score-badge ${getScoreClass(test.recitation)}">${test.recitation}</span></td>
            <td>${test.date}</td>
            <td>${test.studentName}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
            </td>
        `;
        quranTbody.appendChild(row);
    });
    
    // ملء اختبارات التجويد
    const tajweedTbody = document.getElementById("tajweedTestsList");
    tajweedTbody.innerHTML = "";
    tajweedTests.forEach(test => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${test.test}</td>
            <td><span class="score-badge ${getScoreClass(test.result)}">${test.result}</span></td>
            <td>${test.evaluation}</td>
            <td>${test.date}</td>
            <td>${test.studentName}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tajweedTbody.appendChild(row);
    });
    
    // ملء اختبارات الدروس
    const lessonTbody = document.getElementById("lessonTestsList");
    lessonTbody.innerHTML = "";
    lessonTests.forEach(test => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${test.lesson}</td>
            <td><span class="score-badge ${getScoreClass(test.result)}">${test.result}</span></td>
            <td>${test.evaluation}</td>
            <td>${test.date}</td>
            <td>${test.studentName}</td>
            <td class="actions">
                <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
            </td>
        `;
        lessonTbody.appendChild(row);
    });
}

function getScoreClass(score) {
    if (score >= 90) return "excellent";
    if (score >= 80) return "very-good";
    if (score >= 70) return "good";
    return "weak";
}

function logoutAdmin() {
    // هنا سيتم إجراء تسجيل الخروج
    localStorage.removeItem("adminToken");
    window.location.href = "index.html";
}
