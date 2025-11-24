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
   `npm run dev`
## 🏪 نبذة عن المتجر
شركة نجوم دلتا للتجارة - الرواد في تجارة واستيراد الخضروات والفواكه الطازجة وأفخر التمور والبيض في المملكة العربية السعودية

## 🌟 الميزات الرئيسية
- 🛒 **متجر إلكتروني كامل** مع سلة تسوق ومفضلة
- 🤖 **مساعد ذكاء اصطناعي** مدمج باستخدام Gemini AI
- 💰 **نظام محاسبي متكامل** مع دعم الضريبة المضافة (VAT)
- 👔 **لوحة تحكم متقدمة** للإدارة والعملاء VIP
- 📱 **تطبيق ويب تقدمي (PWA)** يعمل دون اتصال
- 🔐 **نظام أمان متقدم** مع مصادقة متعددة العوامل
- 🌍 **واجهة ثنائية اللغة** (عربي/إنجليزي)
- 📊 **تقارير وإحصائيات** حية
- 📱 **تكامل كامل مع وسائل التواصل الاجتماعي** وواتساب الأعمال

## 🚀 التشغيل المحلي

### المتطلبات الأساسية
- Node.js 18.x أو أحدث
- npm 9.x أو أحدث
- مفتاح API من Google Gemini AI

### خطوات التثبيت
```bash
# 1. استنساخ المستودع
git clone https://github.com/your-username/deltastars-frontend.git
cd deltastars-frontend

# 2. تثبيت الحزم
npm install

# 3. إعداد ملف البيئة
cp .env.example .env.local
# ثم افتح ملف .env.local وأدخل مفاتيحك:
# VITE_GEMINI_API_KEY=your_actual_api_key_here
# ... وغيرها من المتغيرات

# 4. تشغيل التطبيق
npm run dev
