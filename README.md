<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1SJxqc9y7rLHpfo4JfSiRfDa4U0PGaRjS

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`# 🌟 متجر نجوم دلتا الإلكتروني

متجر إلكتروني احترافي متكامل لشركة نجوم دلتا للتجارة، مبني بأحدث التقنيات وأفضل الممارسات.

## ✨ الميزات الرئيسية

### 🛍️ المتجر
- عرض المنتجات بشكل احترافي
- بحث وتصفية متقدمة
- سلة التسوق والطلبات
- نظام الخصومات والعروض
- إدارة المخزون

### 👥 المستخدمين
- تسجيل وتسجيل دخول آمن
- ملف شخصي مخصص
- سجل الطلبات
- البصمة والتعرف على الوجه
- تسجيل النشاط

### 📊 لوحة التحكم
- إحصائيات شاملة
- إدارة المنتجات
- إدارة الطلبات
- إدارة المستخدمين
- نظام الصلاحيات

### 🔐 الأمان
- HTTPS و SSL
- JWT Authentication
- CSRF Protection
- Rate Limiting
- تسجيل الأحداث الأمنية

### 🌍 الميزات المتقدمة
- التاريخ الهجري والميلادي
- خريطة جوجل
- دعم اللغتين (عربي/إنجليزي)
- PWA (Progressive Web App)
- Responsive Design

## 🚀 البدء السريع

### المتطلبات
- Python 3.8+
- Node.js 14+
- PostgreSQL أو SQLite

### التثبيت

```bash
# استنساخ المشروع
git clone <repository-url>
cd deltastars_store

# إعداد Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

# إعداد Frontend
cd ../frontend
npm install
```

### التشغيل

```bash
# تشغيل Backend
cd backend
python manage.py runserver

# تشغيل Frontend (في نافذة أخرى)
cd frontend
npm start
```

المتجر سيكون متاحاً على: `http://localhost:3000`

## 📚 التوثيق

للمزيد من المعلومات، راجع [التوثيق الكامل](./DOCUMENTATION.md)

## 👤 المستخدمون الافتراضيون

### مسؤول النظام
- **البريد**: deltastars777@gmail.com
- **كلمة المرور**: Deltastars@2025

## 📞 معلومات الشركة

**شركة نجوم دلتا للتجارة**

- 📧 البريد: INFO@DELTASTARS-KSA.COM
- 📱 الهاتف: 00966920023204
- 💬 واتساب: 00966558828009
- 🌐 الموقع: https://deltastars-ksa.com/ar/
- 📍 الخريطة: https://maps.app.goo.gl/ZHoiZKmkuj4no2vg8

## 📄 الترخيص

جميع الحقوق محفوظة لشركة نجوم دلتا للتجارة © 2025

صنع بواسطة الفريق التقني لـ DeltaStars©

---

**آخر تحديث**: 27 أكتوبر 2025

