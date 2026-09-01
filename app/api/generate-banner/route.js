import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

function cleanHtml(text) {
  let t = (text || '').trim();
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
      schoolName = '',
      headline = 'ขอแสดงความยินดี',
      name = '',
      position = '',
      detail = '',
      footer = '',
      themeColor = '#0b2e6b',
      designPrompt = '',
    } = body || {};

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `คุณเป็นนักออกแบบกราฟิกป้ายประกาศเกียรติคุณ/แสดงความยินดีของโรงเรียนไทยระดับมืออาชีพ
ออกแบบ "ป้ายแสดงความยินดี" แนวนอน ให้สวยงาม หรูหรา ทันสมัย

ข้อมูลที่ต้องใส่ในป้าย:
- ชื่อโรงเรียน (บนสุด): ${schoolName}
- คำนำ (แถบเด่น): ${headline}
- ชื่อบุคคล (ตัวใหญ่ที่สุด เด่นที่สุด): ${name}
- ตำแหน่ง: ${position}
- รายละเอียด/รางวัล (หลายบรรทัด): ${detail}
- ข้อความท้ายป้าย: ${footer}

สีหลักของธีม: ${themeColor}
คำสั่งออกแบบเพิ่มเติม: ${designPrompt || '(ไม่มี — เลือกให้หรูหราสวยงามที่สุด โทนสีไล่เฉดจากสีธีม ตกแต่งด้วยลวดลายทองหรือเส้นสายหรูหรา)'}

ข้อกำหนดผลลัพธ์ (สำคัญมาก ทำตามเคร่งครัด):
1. ตอบเป็น HTML fragment เท่านั้น เริ่มด้วย <style> ตามด้วย <div class="banner-content"> ... </div> ห้ามมี \`\`\`, ห้ามมี <html>/<head>/<body>, ห้ามอธิบาย
2. selector ทุกตัวใน <style> ต้องขึ้นต้นด้วย .banner-content
3. ".banner-content" ต้องกำหนด width:1000px; height:720px; position:relative; overflow:hidden; box-sizing:border-box; และมีพื้นหลังสวยงาม (gradient/ลวดลาย) ตามสีธีม
4. เลย์เอาต์: โซนข้อความอยู่ "ครึ่งซ้าย" (กว้างประมาณ 600px) จัดกึ่งกลางแนวตั้ง / โซนรูปบุคคลอยู่ "ครึ่งขวา"
5. ใส่ตัวยึด 2 ตัวนี้ในตำแหน่งที่กำหนด (ห้ามสร้าง <img> เอง ใส่แค่ตัวยึด):
   - โลโก้โรงเรียน: [[LOGO]]  วางไว้ด้านบน (เหนือชื่อโรงเรียน) ให้มีขนาดประมาณ 90-110px
   - รูปบุคคล: [[PHOTO]]  วางในโซนขวา ชิดขอบล่างขวา สูงเกือบเต็มป้าย
   ระบบภายนอกจะแทนที่ตัวยึดด้วยรูปจริง โดยครอบใน element ที่คุณสร้าง ให้จัด container ของรูปให้เหมาะสม
6. ตัวอักษรทั้งหมดเป็นภาษาไทย ใช้ font-family:'Kanit','Sarabun',sans-serif; ชื่อบุคคลตัวใหญ่ (>=52px) หนา คำนำ headline อยู่ในแถบ/ribbon เด่น รายละเอียดจัดอยู่ในกล่องกรอบสวย ตัวอักษรคอนทราสต์อ่านง่ายบนพื้นหลัง
7. ตกแต่งให้ดูเป็นทางการและหรูหรา เช่น เส้นขอบทอง มุมประดับ เงา ไอคอน 🏆 ⭐ หรือ decorative shapes แต่ต้องไม่บังข้อความ
8. อย่าให้ข้อความหรือรูปล้นออกนอกกรอบ 1000x720

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
