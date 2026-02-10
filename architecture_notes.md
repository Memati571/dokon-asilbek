
# Lazzat Food Delivery System - Arxitektura va Dizayn

## 1. Klasslar Dizayni (Class Design)

Loyiha ob'ektga yo'naltirilgan dasturlash (OOP) tamoyillari asosida quyidagi asosiy klasslar orqali tuzilgan:

- **User (Foydalanuvchi):** Foydalanuvchi profili, rollari (xaridor, restoran egasi, haydovchi) va manzillarini boshqaradi.
- **Restaurant (Restoran):** Restoran haqida ma'lumot, oshxona turi, reyting va joylashuvni saqlaydi.
- **MenuItem (Taom):** Restoran menyusidagi har bir taomning nomi, tavsifi, narxi va toifasini ifodalaydi.
- **Order (Buyurtma):** Buyurtma qilingan taomlar ro'yxati, umumiy summa, holat (status) va yetkazib berish vaqtini boshqaradigan markaziy klass.
- **Cart (Savatcha):** Foydalanuvchi tanlagan vaqtinchalik taomlarni va ularning miqdorini saqlaydi.
- **Courier (Kuryer):** Yetkazib berish jarayonini, transport vositasi ma'lumotlarini va joylashuvini kuzatadi.

## 2. Ma'lumotlar Bazasi Modeli (Database Schema)

Tizim uchun tavsiya etilgan ER (Entity-Relationship) model:

- **Users Table:** `id, name, email, password_hash, phone, default_address, role`
- **Restaurants Table:** `id, name, description, image_url, rating, location_lat, location_lng, cuisine_type`
- **Menu_Items Table:** `id, restaurant_id, name, description, price, category, image_url, availability_status`
- **Orders Table:** `id, user_id, restaurant_id, courier_id, total_amount, status (enum), delivery_address, delivery_type (pickup/delivery), created_at`
- **Order_Items Table:** `id, order_id, menu_item_id, quantity, unit_price`

## 3. Dasturiy Ta'minot Strukturasi

- **Frontend:** React + TypeScript + Tailwind CSS (Responsive va Mobile-first).
- **AI Integratsiya:** Google Gemini API orqali foydalanuvchining kayfiyatiga mos taom tavsiya qilish tizimi.
- **State Management:** React Hooks (`useState`, `useMemo`, `useEffect`).
- **Real-time Tracking:** Buyurtma holatini kuzatish uchun interaktiv progress-bar.

## 4. APK va PWA

Ushbu loyiha Web App sifatida ishlab chiqilgan bo'lib, uni osonlik bilan **Progressive Web App (PWA)** holatiga keltirish yoki **Capacitor/Cordova** yordamida **Android APK** qilib qadoqlash mumkin.
