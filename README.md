# คู่มือการติดตั้งและใช้งาน Smart BMS บน Google App Script

เอกสารนี้จะแนะนำขั้นตอนทั้งหมดในการตั้งค่าระบบบริหารจัดการอัจฉริยะ (Smart BMS) ตั้งแต่ต้นจนจบ เพื่อให้คุณสามารถนำไปใช้งานจริงได้ทันที

## สารบัญ
1.  [ขั้นตอนที่ 1: การเตรียม Google Sheet (ฐานข้อมูล)](#ขั้นตอนที่-1-การเตรียม-google-sheet-ฐานข้อมูล)
2.  [ขั้นตอนที่ 2: การตั้งค่าโปรเจกต์ Google App Script](#ขั้นตอนที่-2-การตั้งค่าโปรเจกต์-google-app-script)
3.  [ขั้นตอนที่ 3: การสร้าง Telegram Bot](#ขั้นตอนที่-3-การสร้าง-telegram-bot)
4.  [ขั้นตอนที่ 4: การนำโค้ดไปใช้งานและรับ Webhook URL](#ขั้นตอนที่-4-การนำโค้ดไปใช้งานและรับ-webhook-url)
5.  [ขั้นตอนที่ 5: การกำหนดค่าเริ่มต้นและตั้งค่า Webhook](#ขั้นตอนที่-5-การกำหนดค่าเริ่มต้นและตั้งค่า-webhook)

---

### ขั้นตอนที่ 1: การเตรียม Google Sheet (ฐานข้อมูล)

1.  **สร้าง Google Sheet ใหม่:**
    *   ไปที่ [Google Sheets](https://sheets.new) และสร้างไฟล์ใหม่
    *   ตั้งชื่อไฟล์ตามที่คุณต้องการ (เช่น "Smart BMS Database")
    *   **คัดลอก URL ของไฟล์นี้เก็บไว้** คุณจะต้องใช้ในภายหลัง

2.  **สร้างชีต (Sheets) ทั้ง 5 ชีต:**
    *   ที่ด้านล่างของหน้าจอ, คลิกที่เครื่องหมายบวก (+) เพื่อสร้างชีตใหม่
    *   สร้างชีตให้ครบ 5 ชีต และเปลี่ยนชื่อตามนี้ (สำคัญมาก ต้องตรงตามนี้ทุกตัวอักษร):
        1.  `Config`
        2.  `Tasks_Data`
        3.  `Personnel_Data`
        4.  `Financial_Data`
        5.  `Templates`

3.  **ตั้งค่าหัวข้อ (Headers) ในแต่ละชีต:**
    *   **ชีต `Config`:**
        *   คอลัมน์ A: `Setting`
        *   คอลัมน์ B: `Value`
    *   **ชีต `Tasks_Data`:**
        *   `Task_ID`, `Date_Created`, `Date_Due`, `Work_Type`, `Status`, `Assigned_User_ID`, `Description`, `Priority`
    *   **ชีต `Personnel_Data`:**
        *   `User_ID`, `Name`, `Type`, `Role`, `Contact_Info`, `Historical_Notes`, `Rental_Unit_ID`
    *   **ชีต `Financial_Data`:**
        *   `Trans_ID`, `Type`, `Date`, `Amount`, `Associated_User_ID`, `Status`, `Calculation_Detail_JSON`
    *   **ชีต `Templates`:**
        *   `Template_Name`, `Template_Content`

---

### ขั้นตอนที่ 2: การตั้งค่าโปรเจกต์ Google App Script

1.  **เปิด Google App Script Editor:**
    *   จากไฟล์ Google Sheet ที่คุณสร้าง, ไปที่ `ส่วนขยาย (Extensions)` > `Apps Script`
    *   ระบบจะเปิดหน้าต่างใหม่สำหรับเขียนโค้ด

2.  **ตั้งชื่อโปรเจกต์:**
    *   คลิกที่ "Untitled project" และตั้งชื่อโปรเจกต์ของคุณ (เช่น "Smart BMS Bot Logic")

3.  **ลบโค้ดเริ่มต้น:**
    *   ในไฟล์ `Code.gs` ที่มีอยู่, ลบฟังก์ชัน `myFunction` ที่มีมาให้ทั้งหมด

---

### ขั้นตอนที่ 3: การสร้าง Telegram Bot

1.  **เปิด Telegram และค้นหา "BotFather":** BotFather คือบอทอย่างเป็นทางการของ Telegram สำหรับสร้างและจัดการบอทอื่นๆ
2.  **สร้าง Bot ใหม่:**
    *   ส่งคำสั่ง `/newbot` ให้กับ BotFather
    *   ทำตามขั้นตอนโดยการตั้งชื่อ (Display Name) และชื่อผู้ใช้ (Username) สำหรับบอทของคุณ (Username ต้องลงท้ายด้วย `bot`)
3.  **คัดลอก Bot Token:**
    *   เมื่อสร้างสำเร็จ, BotFather จะส่งข้อความที่มี **Telegram Token** มาให้
    *   **คัดลอก Token นี้และเก็บไว้ในที่ปลอดภัย**

---

### ขั้นตอนที่ 4: การนำโค้ดไปใช้งานและรับ Webhook URL

1.  **นำโค้ดทั้งหมดไปวางใน App Script:** ทำตามขั้นตอนเดิมในการสร้างไฟล์ `.gs` ทั้งหมดในโปรเจกต์ App Script ของคุณ
2.  **ทำให้โปรเจกต์เป็น Web App (Deploy):**
    *   คลิก `ทำให้ใช้งานได้ (Deploy)` > `การทำให้ใช้งานได้รายการใหม่ (New deployment)`
    *   **ตั้งค่า:** `ประเภท` > `เว็บแอป`, `เรียกใช้เป็น` > `ฉัน`, `ผู้ที่มีสิทธิ์เข้าถึง` > `ทุกคน`
    *   คลิก `ทำให้ใช้งานได้ (Deploy)` และ **ให้สิทธิ์การเข้าถึง (Authorize access)** เมื่อถูกถาม
3.  **คัดลอก Web App URL:**
    *   หลังจาก Deploy สำเร็จ, คุณจะได้รับ **URL ของเว็บแอป**
    *   **คัดลอก URL นี้เก็บไว้** นี่คือ URL หลักสำหรับ Webhook ของคุณ

---

### ขั้นตอนที่ 5: การกำหนดค่าเริ่มต้นและตั้งค่า Webhook

1.  **กลับไปที่ Google Sheet** และเปิดชีต `Config`
2.  **ใส่ข้อมูลการตั้งค่าพื้นฐาน:**
    *   **SHEET_ID:** วาง ID ของ Google Sheet ของคุณ
    *   **TELEGRAM_BOT_TOKEN:** วาง Telegram Token ที่คัดลอกมา
    *   **AI_SERVICE_API_KEY:** (สำหรับอนาคต) วาง API Key สำหรับบริการ AI ที่คุณเลือกใช้
    *   ใส่ค่าอื่นๆ ที่จำเป็น เช่น `TAX_RATE`, `RENTAL_BASE_RATE`

    ***หมายเหตุ:*** *ปัจจุบันระบบใช้ AIจำลอง (Mock AI) จึงยังไม่จำเป็นต้องใช้ `AI_SERVICE_API_KEY` แต่มีการเตรียมช่องไว้สำหรับอนาคต*

3.  **ตั้งค่า Webhook สำหรับ Telegram:**
    *   คุณต้อง "ลงทะเบียน" Webhook URL ของคุณกับ Telegram API ด้วยตนเอง
    *   สร้าง URL ตามรูปแบบนี้: `https://api.telegram.org/bot<YOUR_TELEGRAM_TOKEN>/setWebhook?url=<YOUR_WEB_APP_URL>`
    *   **แทนที่ `<YOUR_TELEGRAM_TOKEN>`** ด้วย Token ของคุณ
    *   **แทนที่ `<YOUR_WEB_APP_URL>`** ด้วย Web App URL ของคุณ
    *   นำ URL ที่สร้างเสร็จแล้วไปวางในเบราว์เซอร์และกด Enter
    *   หากสำเร็จ คุณจะเห็นข้อความ: `{"ok":true,"result":true,"description":"Webhook was set"}`

**ยินดีด้วย!** ตอนนี้ระบบ Smart BMS ของคุณพร้อมใช้งานแล้ว คุณสามารถเริ่มใช้คำสั่งต่างๆ ผ่าน Telegram Bot ของคุณได้เลย
