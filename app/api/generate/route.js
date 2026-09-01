import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

// ทำความสะอาดผลลัพธ์จาก Gemini ให้เหลือเฉพาะ HTML fragment
function cleanHtml(text) {
  let t = (text || '').trim();
  // ตัด code fence ```html ... ``` ถ้ามี
  t = t.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
  return t;
}

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY บนเซิร์ฟเวอร์' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      title = '',
      content = '',
      designPrompt = '',
      themeColor = '#0b6b3a',
      imageCount = 0,
    } = body || {};

    const genAI = new GoogleGenerativeAI(apiKey);
    // เปลี่ยนชื่อโมเดลได้ที่ env GEMINI_MODEL (ค่าเริ่มต้น = gemini-3.6-flash)
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const imagesNote =
      imageCount > 0
        ? `มีรูปภาพที่ผู้ใช้อัปโหลด ${imageCount} รูป ให้วางไว้ในตำแหน่งที่เหมาะสมโดยใช้ตัวยึด (placeholder) พอดีจำนวนคือ ${Array.from(
            { length: imageCount },
            (_, i) => `[[IMAGE_${i + 1}]]`
          ).join(', ')} ห้ามสร้าง <img> เอง ให้ใส่เฉพาะตัวยึดนี้ในตำแหน่งที่ต้องการวางรูปเท่านั้น`
        : 'ไม่มีรูปภาพอัปโหลด ห้ามใส่ตัวยึดรูปภาพใด ๆ';

    const prompt = `คุณเป็นดีไซเนอร์อินโฟกราฟิกมืออาชีพ ออกแบบ "เนื้อหาส่วนกลาง" ของโปสเตอร์ขนาด A4 แนวตั้ง (ส่วนหัวกระดาษ โลโก้ ชื่อโรงเรียน ระบบภายนอกจัดการให้แล้ว คุณออกแบบเฉพาะส่วนเนื้อหา)

เรื่อง (หัวข้อใหญ่): ${title}

เนื้อหา:
${content}

คำสั่งการออกแบบเพิ่มเติมจากผู้ใช้: ${designPrompt || '(ไม่มี — ให้เลือกให้สวยงามทันสมัยที่สุด)'}

สีหลักของธีม (theme color): ${themeColor}

${imagesNote}

ข้อกำหนดผลลัพธ์ (สำคัญมาก ทำตามเคร่งครัด):
1. ตอบกลับเป็น "HTML fragment" เท่านั้น — เริ่มด้วย <style> ตามด้วย <div class="ig-content"> ... </div> ห้ามมี \`\`\`, ห้ามมี <html>, <head>, <body>, ห้ามอธิบายใด ๆ
2. ใช้ CSS ได้เฉพาะภายใน <style> โดย selector ทุกตัวต้องขึ้นต้นด้วย .ig-content เพื่อไม่ให้กระทบส่วนอื่น
3. ความกว้างพื้นที่คือ 754px สูงไม่เกิน ~980px (นี่คือพื้นที่ที่เหลือบนกระดาษ A4 หลังหักส่วนหัว) จัดเนื้อหาให้พอดี ไม่ล้น
4. ออกแบบสไตล์อินโฟกราฟิกแบน (flat) ทันสมัย สะอาดตา อ่านง่าย: มีหัวข้อใหญ่เด่น, แบ่งเนื้อหาเป็นการ์ด/กล่องสี/รายการหัวข้อย่อย, ใช้ตัวเลขลำดับหรือไอคอน emoji ประกอบ (เช่น ✅ 📌 🎯 📊 💡 ⭐ 🏫 📖) ให้เหมาะกับเนื้อหา
5. ใช้สีธีม ${themeColor} เป็นสีหลัก และสร้างเฉดอ่อน/เข้มจากสีนี้ให้กลมกลืน ตัวอักษรต้องคอนทราสต์อ่านง่าย ฟอนต์ตัวใหญ่พอควร (เนื้อหา >= 18px หัวข้อย่อย >= 22px หัวข้อใหญ่ >= 34px)
6. ทุกอย่างเป็นภาษาไทย ใช้ font-family: 'Sarabun','Kanit',sans-serif;
7. ถ้ามีตัวยึดรูปภาพ ให้จัดกรอบสวย ๆ รอบตำแหน่งที่วาง เช่นใส่ border-radius, เงา
8. อย่าใส่พื้นหลังสีเข้มเต็มพื้นที่จนเปลืองหมึกพิมพ์ ให้พื้นหลังหลักเป็นสีขาว/อ่อน

ส่งเฉพาะโค้ด HTML fragment กลับมาเท่านั้น`;

    const result = await model.generateContent(prompt);
    const html = cleanHtml(result.response.text());

    return Response.json({ html });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'สร้างไม่สำเร็จ: ' + (err?.message || 'unknown error') },
      { status: 500 }
    );
  }
}
