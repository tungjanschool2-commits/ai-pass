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
      title = '',
      subtitle = '',
      period = '',
      name = '',
      nameNote = '',
      position = '',
      schoolName = '',
      schoolInfo = '',
      quote = '',
      themeColor = '#9b5a4a',
      designPrompt = '',
    } = body || {};

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `คุณเป็นนักออกแบบปกรายงาน/ปกผลงานทางการศึกษาของไทยระดับมืออาชีพ
ออกแบบ "ปกรายงาน" ขนาด A4 แนวตั้ง ให้สวยงาม หรูหรา ทางการ อ่านง่าย

ข้อมูลที่ต้องใส่ในปก:
- ชื่อเรื่อง (ตัวใหญ่ที่สุด บนซ้าย): ${title}
- คำบรรยายรอง (หลายบรรทัด): ${subtitle}
- ช่วง/ครั้งที่ (อยู่ในป้ายเม็ดยา): ${period}
- ชื่อบุคคล (ในแถบเฉียงเด่น): ${name}
- หมายเหตุชื่อ: ${nameNote}
- ตำแหน่ง: ${position}
- ชื่อโรงเรียน (มุมล่างซ้าย มีไอคอน): ${schoolName}
- ข้อมูลสังกัด (หลายบรรทัด): ${schoolInfo}
- คำคม (มุมล่างขวา ตัวเอียง มีเครื่องหมายคำพูด): ${quote}

สีหลักของธีม: ${themeColor}
คำสั่งออกแบบเพิ่มเติม: ${designPrompt || '(ไม่มี — เลือกโทนอบอุ่นหรูหรา ไล่เฉดจากสีธีม มีลวดลายมุมประดับ)'}

ข้อกำหนดผลลัพธ์ (สำคัญมาก ทำตามเคร่งครัด):
1. ตอบเป็น HTML fragment เท่านั้น เริ่มด้วย <style> ตามด้วย <div class="cover-content"> ... </div> ห้ามมี \`\`\`, ห้ามมี <html>/<head>/<body>, ห้ามอธิบาย
2. selector ทุกตัวใน <style> ต้องขึ้นต้นด้วย .cover-content
3. ".cover-content" ต้องกำหนด width:794px; height:1123px; position:relative; overflow:hidden; box-sizing:border-box; font-family:'Kanit','Sarabun',sans-serif;
4. ต้องมีชั้นพื้นหลังรูปภาพเต็มหน้า: สร้าง <div class="bg">[[PHOTO]]</div> วางเป็นชั้นล่างสุด (position:absolute;inset:0;z-index:0) ให้รูปเต็มพื้นที่แบบ object-fit:cover
5. ต้องมีชั้น overlay ไล่เฉดสี (position:absolute;inset:0;z-index:1) ทำให้ "ฝั่งซ้าย" ทึบพอให้อ่านตัวอักษรได้ชัด และ "ฝั่งขวา" โปร่งเพื่อโชว์รูปบุคคล
6. ตัวอักษรและองค์ประกอบทั้งหมดอยู่ z-index:2 ขึ้นไป จัดวางตามนี้:
   - มุมบนซ้าย: ชื่อเรื่อง + คำบรรยาย + ป้ายช่วงเวลา
   - มุมบนขวา: โลโก้โรงเรียนในกรอบ ใส่ตัวยึด [[LOGO]] (ห้ามสร้าง <img> เอง)
   - กลางค่อนซ้าย: แถบเฉียง (skew) ใส่ชื่อบุคคล + หมายเหตุ + ตำแหน่ง
   - ล่างซ้าย: ไอคอน+ชื่อโรงเรียน และข้อมูลสังกัด และแถวไอคอนวงกลม (เช่น 📖 👥 🎓 🏆)
   - ล่างขวา: คำคมตัวเอียงพร้อมเครื่องหมายคำพูดขนาดใหญ่
7. ตัวอักษรภาษาไทยทั้งหมด ชื่อเรื่องใหญ่ (>=48px) หนา ใช้สีเข้มคอนทราสต์กับ overlay ใช้สีธีมเป็นสีเน้น
8. อย่าให้ข้อความล้นออกนอกกรอบ 794x1123 และอย่าให้ข้อความทับกันจนอ่านไม่ออก

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
