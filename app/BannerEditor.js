'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const PRESET_COLORS = [
  '#0b2e6b', // น้ำเงินกรมท่า (แบบตัวอย่าง)
  '#7c1d1d', // แดงเลือดหมู
  '#14532d', // เขียวเข้ม
  '#4a148c', // ม่วงเข้ม
  '#0f3d3e', // เขียวมรกตเข้ม
  '#7c2d12', // น้ำตาลทองแดง
  '#1a237e', // น้ำเงินอินดิโก
  '#111827', // ดำหรู
];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ----- ป้ายตัวอย่าง (เดโม) ใช้ได้โดยไม่ต้องมี API key -----
const SAMPLE = {
  schoolName: 'โรงเรียนวัดทุ่งจาน',
  headline: 'ขอแสดงความยินดี',
  name: 'นางจุไรรัตน์ วอนพรมราช',
  position: 'ผู้อำนวยการโรงเรียนบ้านสุขัง(ราษฎร์สามัคคี)',
  detail:
    'ได้รับรางวัลผู้บริหารสถานศึกษาที่มีวิธีปฏิบัติที่เป็นเลิศ (Best Practice) ระดับดีเยี่ยม\nด้านการวัดและประเมินผลในชั้นเรียนเพื่อพัฒนาการเรียนรู้ของผู้เรียน (Assessment for Learning)',
  footer: 'โดย สำนักงานเขตพื้นที่การศึกษาประถมศึกษานครราชสีมา เขต 3',
  themeColor: '#0b2e6b',
  designPrompt: 'โทนน้ำเงินหรูหรา ลวดลายเทคโนโลยี ประดับทอง',
  html: `<style>
  .banner-content{width:1000px;height:720px;position:relative;overflow:hidden;box-sizing:border-box;font-family:'TH SarabunPSK','TH Sarabun New','Sarabun',sans-serif;background:radial-gradient(120% 100% at 80% 10%,#1e4d9b 0%,#0b2e6b 45%,#071f4a 100%);}
  .banner-content .deco-1{position:absolute;inset:0;background:
     radial-gradient(circle at 15% 85%,rgba(255,255,255,.06),transparent 25%),
     radial-gradient(circle at 70% 20%,rgba(120,180,255,.12),transparent 30%);}
  .banner-content .frame{position:absolute;inset:16px;border:2px solid rgba(212,175,55,.55);border-radius:14px;pointer-events:none;}
  .banner-content .left{position:absolute;left:44px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;z-index:3;}
  .banner-content .logo-wrap{margin-bottom:6px;}
  .banner-content .logo-wrap img,.banner-content .logo-ph{width:96px;height:96px;object-fit:contain;}
  .banner-content .logo-ph{border-radius:50%;border:2px dashed rgba(212,175,55,.7);display:flex;align-items:center;justify-content:center;color:#d4af37;font-size:34px;}
  .banner-content .school{color:#fff;font-size:30px;font-weight:700;text-shadow:0 2px 6px rgba(0,0,0,.4);margin-bottom:14px;}
  .banner-content .ribbon{background:linear-gradient(90deg,#b8860b,#f5d271,#b8860b);color:#3a2a00;font-size:26px;font-weight:700;padding:8px 40px;border-radius:30px;box-shadow:0 6px 16px rgba(0,0,0,.35);margin-bottom:16px;}
  .banner-content .name{color:#ffe8a3;font-size:52px;font-weight:800;line-height:1.1;text-shadow:0 3px 8px rgba(0,0,0,.5);}
  .banner-content .position{color:#dbe7ff;font-size:22px;margin:8px 0 16px;}
  .banner-content .award{background:rgba(255,255,255,.10);border:1.5px solid rgba(212,175,55,.6);border-radius:14px;padding:16px 22px;max-width:560px;}
  .banner-content .award .a-title{color:#ffe8a3;font-size:21px;font-weight:600;line-height:1.45;}
  .banner-content .award .a-sub{color:#e6eefc;font-size:18px;line-height:1.45;margin-top:6px;}
  .banner-content .footer{position:absolute;left:44px;right:44px;bottom:26px;text-align:center;color:#cfe0ff;font-size:16px;z-index:3;}
  .banner-content .photo{position:absolute;right:0;bottom:0;width:430px;height:680px;z-index:2;display:flex;align-items:flex-end;justify-content:center;}
  .banner-content .photo img{max-width:100%;max-height:100%;object-fit:contain;object-position:bottom;filter:drop-shadow(-6px 0 14px rgba(0,0,0,.35));}
  .banner-content .photo-ph{width:340px;height:560px;border-radius:16px;background:rgba(255,255,255,.08);border:2px dashed rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.6);font-size:90px;}
  .banner-content .trophy{position:absolute;left:60px;bottom:70px;font-size:60px;z-index:1;opacity:.9;}
</style>
<div class="banner-content">
  <div class="deco-1"></div>
  <div class="frame"></div>
  <div class="left">
    <div class="logo-wrap">[[LOGO]]</div>
    <div class="school">โรงเรียนบ้านสุขัง(ราษฎร์สามัคคี)</div>
    <div class="ribbon">✦ ขอแสดงความยินดี ✦</div>
    <div class="name">นางจุไรรัตน์ วอนพรมราช</div>
    <div class="position">ผู้อำนวยการโรงเรียนบ้านสุขัง(ราษฎร์สามัคคี)</div>
    <div class="award">
      <div class="a-title">ได้รับรางวัลผู้บริหารสถานศึกษาที่มีวิธีปฏิบัติที่เป็นเลิศ (Best Practice) ระดับดีเยี่ยม</div>
      <div class="a-sub">ด้านการวัดและประเมินผลในชั้นเรียนเพื่อพัฒนาการเรียนรู้ของผู้เรียน (Assessment for Learning)</div>
    </div>
  </div>
  <div class="photo">[[PHOTO]]</div>
  <div class="footer">โดย สำนักงานเขตพื้นที่การศึกษาประถมศึกษานครราชสีมา เขต 3</div>
</div>`,
};

export default function BannerEditor() {
  const [schoolName, setSchoolName] = useState('โรงเรียนวัดทุ่งจาน');
  const [headline, setHeadline] = useState('ขอแสดงความยินดี');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [detail, setDetail] = useState('');
  const [footer, setFooter] = useState(
    'โดย สำนักงานเขตพื้นที่การศึกษาประถมศึกษานครราชสีมา เขต 3'
  );
  const [themeColor, setThemeColor] = useState('#0b2e6b');
  const [designPrompt, setDesignPrompt] = useState('');
  const [logo, setLogo] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [genHtml, setGenHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);

  const bannerRef = useRef(null);
  const scaleWrapRef = useRef(null);

  useEffect(() => {
    function fit() {
      const wrap = scaleWrapRef.current;
      if (!wrap) return;
      const avail = wrap.parentElement.clientWidth - 52;
      const s = Math.min(1, avail / 1000);
      setScale(s > 0 ? s : 1);
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  async function onLogoChange(e) {
    const f = e.target.files?.[0];
    if (f) setLogo(await readFileAsDataURL(f));
  }
  async function onPhotoChange(e) {
    const f = e.target.files?.[0];
    if (f) setPhoto(await readFileAsDataURL(f));
  }

  function loadSample() {
    setError('');
    setSchoolName(SAMPLE.schoolName);
    setHeadline(SAMPLE.headline);
    setName(SAMPLE.name);
    setPosition(SAMPLE.position);
    setDetail(SAMPLE.detail);
    setFooter(SAMPLE.footer);
    setThemeColor(SAMPLE.themeColor);
    setDesignPrompt(SAMPLE.designPrompt);
    setGenHtml(SAMPLE.html);
  }

  async function generate() {
    setError('');
    if (!name.trim()) {
      setError('กรุณากรอก "ชื่อบุคคล" ก่อน');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          headline,
          name,
          position,
          detail,
          footer,
          themeColor,
          designPrompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
      setGenHtml(data.html || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // แทนที่ตัวยึดโลโก้/รูปบุคคลด้วยรูปจริง (หรือ placeholder ถ้ายังไม่ได้อัปโหลด)
  const finalHtml = useMemo(() => {
    if (!genHtml) return '';
    let html = genHtml;
    const logoTag = logo
      ? `<img src="${logo}" alt="โลโก้" />`
      : `<div class="logo-ph">🏫</div>`;
    const photoTag = photo
      ? `<img src="${photo}" alt="บุคคล" />`
      : `<div class="photo-ph">👤</div>`;
    html = html.split('[[LOGO]]').join(logoTag);
    html = html.split('[[PHOTO]]').join(photoTag);
    return html;
  }, [genHtml, logo, photo]);

  async function exportImage(fmt) {
    setError('');
    if (!genHtml) {
      setError('กรุณากด "สร้างป้าย" หรือ "ดูตัวอย่าง" ก่อน');
      return;
    }
    try {
      const { default: html2canvas } = await import('html2canvas');
      if (document.fonts?.ready) await document.fonts.ready;
      const el = bannerRef.current;
      const wrap = scaleWrapRef.current;
      const prevTransform = wrap ? wrap.style.transform : '';
      if (wrap) wrap.style.transform = 'none';
      let canvas;
      try {
        canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 1000,
          height: 720,
          windowWidth: 1000,
        });
      } finally {
        if (wrap) wrap.style.transform = prevTransform;
      }
      const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
      const data = canvas.toDataURL(mime, 0.95);
      const a = document.createElement('a');
      const fname = (name || 'banner').replace(/[\\/:*?"<>|]/g, '_');
      a.href = data;
      a.download = `${fname}.${fmt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('บันทึกรูปไม่สำเร็จ: ' + err.message);
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🏅 สร้างป้ายแสดงความยินดี</h2>
        <div className="sub">เปลี่ยนรูป/โลโก้/ข้อความ แล้วให้ AI ออกแบบให้หรูหรา</div>

        <div className="field">
          <label>ชื่อโรงเรียน</label>
          <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        </div>
        <div className="field">
          <label>คำนำ (แถบเด่น)</label>
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div className="field">
          <label>ชื่อบุคคล (ตัวใหญ่สุด)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น นางจุไรรัตน์ วอนพรมราช"
          />
        </div>
        <div className="field">
          <label>ตำแหน่ง</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="เช่น ผู้อำนวยการโรงเรียน..."
          />
        </div>
        <div className="field">
          <label>รายละเอียด/รางวัล (เว้นบรรทัดได้)</label>
          <textarea rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} />
        </div>
        <div className="field">
          <label>ข้อความท้ายป้าย</label>
          <input type="text" value={footer} onChange={(e) => setFooter(e.target.value)} />
        </div>

        <div className="field">
          <label>โลโก้โรงเรียน (PNG/JPG)</label>
          <input type="file" accept="image/png,image/jpeg" onChange={onLogoChange} />
        </div>
        <div className="field">
          <label>รูปบุคคล (แนะนำ PNG พื้นหลังใส)</label>
          <input type="file" accept="image/png,image/jpeg" onChange={onPhotoChange} />
          {photo && (
            <div className="thumbs">
              <div className="thumb">
                <img src={photo} alt="บุคคล" />
                <button type="button" onClick={() => setPhoto(null)}>
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="field">
          <label>คำสั่งออกแบบ (สไตล์ / อารมณ์)</label>
          <textarea
            rows={2}
            value={designPrompt}
            onChange={(e) => setDesignPrompt(e.target.value)}
            placeholder="เช่น โทนทองหรูหรา, ลายไทยประยุกต์, มินิมอลสะอาดตา"
          />
        </div>

        <div className="field">
          <label>สีหลักของธีม</label>
          <div className="row color-row">
            <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
            <div className="swatches">
              {PRESET_COLORS.map((c) => (
                <div
                  key={c}
                  className="swatch"
                  style={{ background: c }}
                  onClick={() => setThemeColor(c)}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? '⏳ AI กำลังออกแบบ...' : '✨ สร้างป้าย (ใช้ AI)'}
        </button>
        <button className="btn btn-ghost" onClick={loadSample}>
          👁️ ดูตัวอย่าง (ไม่ต้องใช้ AI)
        </button>

        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => exportImage('png')}>
            ⬇️ บันทึก PNG
          </button>
          <button className="btn btn-outline" onClick={() => exportImage('jpg')}>
            ⬇️ บันทึก JPG
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="hint">
          เคล็ดลับ: รูปบุคคลที่เป็น PNG พื้นหลังใส (ตัดฉากออกแล้ว) จะสวยที่สุด •
          กด “สร้างป้าย” ซ้ำเพื่อสุ่มดีไซน์ใหม่ได้
        </div>
      </aside>

      <main className="canvas-area">
        <div
          ref={scaleWrapRef}
          className="a4-scale"
          style={{ transform: `scale(${scale})`, height: 720 * scale, width: 1000 }}
        >
          <div className="banner" ref={bannerRef} style={{ '--paper-brand': themeColor }}>
            {finalHtml ? (
              <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
            ) : (
              <div className="banner-empty">
                🏅 พรีวิวป้ายจะแสดงที่นี่
                <br />
                กรอกข้อมูล แล้วกด “สร้างป้าย” หรือ “ดูตัวอย่าง”
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
