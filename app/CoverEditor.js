'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const PRESET_COLORS = [
  '#9b5a4a', // เทอร์ราคอตตา (แบบตัวอย่าง)
  '#7a2e3a', // ไวน์แดง
  '#0b3d91', // น้ำเงินราชการ
  '#14532d', // เขียวเข้ม
  '#6d28d9', // ม่วง
  '#b45309', // ส้มทอง
  '#0f766e', // เขียวมรกต
  '#1f2937', // เทาเข้ม
];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ----- ปกตัวอย่าง (เดโม) ใช้ได้โดยไม่ต้องมี API key -----
const SAMPLE = {
  title: 'รายงานผลการปฏิบัติงาน',
  subtitle:
    'ของข้าราชการครูและบุคลากรทางการศึกษา (สายงานการสอน)\nและเพื่อประกอบพิจารณาการเลื่อนเงินเดือน',
  period: 'ครั้งที่ 1 (1 ตุลาคม 2569 – 31 มีนาคม 2570)',
  name: 'นางสาวพิมพ์ชนก ศรีสวัสดิ์',
  nameNote: '(นามสมมติ)',
  position: 'ตำแหน่ง ครู วิทยฐานะ ชำนาญการ',
  schoolName: 'โรงเรียนคลังสื่อวิทยาคม',
  schoolInfo:
    'สังกัด สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมมติ เขต 1\nสำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน\nกระทรวงศึกษาธิการ',
  quote: 'ครูคือผู้สร้างอนาคต\nด้วยความรู้ คู่คุณธรรม',
  themeColor: '#9b5a4a',
  designPrompt: 'โทนอบอุ่นสีชมพูเบจ หรูหรา ทางการ',
  html: `<style>
  .cover-content{width:794px;height:1123px;position:relative;overflow:hidden;box-sizing:border-box;font-family:'TH SarabunPSK','TH Sarabun New','Sarabun',sans-serif;background:linear-gradient(135deg,#f5e6dd 0%,#ecd0c3 55%,#dcb4a4 100%);}
  .cover-content .bg{position:absolute;inset:0;z-index:0;}
  .cover-content .bg img{width:100%;height:100%;object-fit:cover;object-position:center top;}
  .cover-content .bg-ph{width:100%;height:100%;display:flex;align-items:flex-end;justify-content:flex-end;font-size:220px;opacity:.18;padding-right:40px;}
  .cover-content .overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(100deg,rgba(247,236,229,.97) 0%,rgba(247,236,229,.9) 34%,rgba(247,236,229,.35) 56%,rgba(247,236,229,0) 74%);}
  .cover-content .corner{position:absolute;top:34px;left:34px;width:70px;height:70px;border-top:3px solid var(--paper-brand,#9b5a4a);border-left:3px solid var(--paper-brand,#9b5a4a);border-radius:6px 0 0 0;z-index:2;}
  .cover-content .head{position:absolute;top:74px;left:56px;right:220px;z-index:2;}
  .cover-content .title{font-size:52px;font-weight:800;color:var(--paper-brand,#9b5a4a);line-height:1.02;}
  .cover-content .sub{font-size:23px;font-weight:600;color:#5b4038;margin-top:10px;line-height:1.35;}
  .cover-content .period{display:inline-block;margin-top:16px;background:var(--paper-brand,#9b5a4a);color:#fff;font-size:17px;padding:7px 22px;border-radius:22px;box-shadow:0 4px 10px rgba(0,0,0,.18);}
  .cover-content .logo-banner{position:absolute;top:40px;right:52px;z-index:2;text-align:center;}
  .cover-content .logo-banner img,.cover-content .logo-ph{width:118px;height:118px;object-fit:contain;}
  .cover-content .logo-ph{border-radius:50%;border:2px dashed var(--paper-brand,#9b5a4a);display:flex;align-items:center;justify-content:center;color:var(--paper-brand,#9b5a4a);font-size:44px;background:rgba(255,255,255,.5);}
  .cover-content .name-wrap{position:absolute;top:520px;left:0;z-index:2;}
  .cover-content .ribbon{display:inline-block;background:linear-gradient(90deg,rgba(155,90,74,.92),rgba(190,140,125,.55));transform:skewX(-13deg);padding:14px 52px 14px 56px;box-shadow:0 6px 16px rgba(0,0,0,.18);}
  .cover-content .ribbon .inner{transform:skewX(13deg);}
  .cover-content .name{font-size:36px;font-weight:800;color:#fff;text-shadow:0 2px 5px rgba(0,0,0,.28);}
  .cover-content .name-note{font-size:19px;color:#fdeee7;margin-top:2px;}
  .cover-content .position{margin:18px 0 0 56px;font-size:20px;color:#5b4038;border-top:1.5px solid rgba(91,64,56,.35);padding-top:10px;display:inline-block;}
  .cover-content .school-block{position:absolute;left:56px;bottom:172px;right:250px;z-index:2;}
  .cover-content .school-name{display:flex;align-items:center;gap:12px;font-size:29px;font-weight:800;color:var(--paper-brand,#9b5a4a);}
  .cover-content .school-name .ic{font-size:32px;}
  .cover-content .school-info{font-size:16px;color:#5b4038;line-height:1.65;margin-top:8px;}
  .cover-content .icons{position:absolute;left:56px;bottom:64px;z-index:2;display:flex;align-items:center;gap:14px;}
  .cover-content .icons .ci{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 3px 8px rgba(0,0,0,.12);}
  .cover-content .icons .dot{width:6px;height:6px;border-radius:50%;background:var(--paper-brand,#9b5a4a);}
  .cover-content .quote{position:absolute;right:44px;bottom:74px;z-index:2;max-width:280px;text-align:right;color:#5b4038;font-size:22px;font-style:italic;line-height:1.45;}
  .cover-content .quote .mark{font-size:44px;color:var(--paper-brand,#9b5a4a);line-height:0;vertical-align:-12px;}
</style>
<div class="cover-content">
  <div class="bg">[[PHOTO]]</div>
  <div class="overlay"></div>
  <div class="corner"></div>
  <div class="head">
    <div class="title">รายงานผลการปฏิบัติงาน</div>
    <div class="sub">ของข้าราชการครูและบุคลากรทางการศึกษา (สายงานการสอน)<br/>และเพื่อประกอบพิจารณาการเลื่อนเงินเดือน</div>
    <div class="period">ครั้งที่ 1 (1 ตุลาคม 2569 – 31 มีนาคม 2570)</div>
  </div>
  <div class="logo-banner">[[LOGO]]</div>
  <div class="name-wrap">
    <div class="ribbon"><div class="inner">
      <div class="name">นางสาวพิมพ์ชนก ศรีสวัสดิ์</div>
      <div class="name-note">(นามสมมติ)</div>
    </div></div>
    <div><div class="position">ตำแหน่ง ครู วิทยฐานะ ชำนาญการ</div></div>
  </div>
  <div class="school-block">
    <div class="school-name"><span class="ic">🏫</span> โรงเรียนคลังสื่อวิทยาคม</div>
    <div class="school-info">สังกัด สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมมติ เขต 1<br/>สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน<br/>กระทรวงศึกษาธิการ</div>
  </div>
  <div class="icons">
    <div class="ci">📖</div><div class="dot"></div>
    <div class="ci">👥</div><div class="dot"></div>
    <div class="ci">🎓</div><div class="dot"></div>
    <div class="ci">🏆</div>
  </div>
  <div class="quote"><span class="mark">“</span>ครูคือผู้สร้างอนาคต<br/>ด้วยความรู้ คู่คุณธรรม<span class="mark">”</span></div>
</div>`,
};

export default function CoverEditor() {
  const [title, setTitle] = useState('รายงานผลการปฏิบัติงาน');
  const [subtitle, setSubtitle] = useState(
    'ของข้าราชการครูและบุคลากรทางการศึกษา (สายงานการสอน)\nและเพื่อประกอบพิจารณาการเลื่อนเงินเดือน'
  );
  const [period, setPeriod] = useState('');
  const [name, setName] = useState('');
  const [nameNote, setNameNote] = useState('');
  const [position, setPosition] = useState('');
  const [schoolName, setSchoolName] = useState('โรงเรียนวัดทุ่งจาน');
  const [schoolInfo, setSchoolInfo] = useState(
    'อำเภอปักธงชัย จังหวัดนครราชสีมา\nสำนักงานเขตพื้นที่การศึกษาประถมศึกษานครราชสีมา เขต 3'
  );
  const [quote, setQuote] = useState('');
  const [themeColor, setThemeColor] = useState('#9b5a4a');
  const [designPrompt, setDesignPrompt] = useState('');
  const [logo, setLogo] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [genHtml, setGenHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);

  const coverRef = useRef(null);
  const scaleWrapRef = useRef(null);

  useEffect(() => {
    function fit() {
      const wrap = scaleWrapRef.current;
      if (!wrap) return;
      const avail = wrap.parentElement.clientWidth - 52;
      const s = Math.min(1, avail / 794);
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
    setTitle(SAMPLE.title);
    setSubtitle(SAMPLE.subtitle);
    setPeriod(SAMPLE.period);
    setName(SAMPLE.name);
    setNameNote(SAMPLE.nameNote);
    setPosition(SAMPLE.position);
    setSchoolName(SAMPLE.schoolName);
    setSchoolInfo(SAMPLE.schoolInfo);
    setQuote(SAMPLE.quote);
    setThemeColor(SAMPLE.themeColor);
    setDesignPrompt(SAMPLE.designPrompt);
    setGenHtml(SAMPLE.html);
  }

  async function generate() {
    setError('');
    if (!title.trim() && !name.trim()) {
      setError('กรุณากรอก "ชื่อเรื่อง" หรือ "ชื่อบุคคล" ก่อน');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          period,
          name,
          nameNote,
          position,
          schoolName,
          schoolInfo,
          quote,
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

  const finalHtml = useMemo(() => {
    if (!genHtml) return '';
    let html = genHtml;
    const logoTag = logo
      ? `<img src="${logo}" alt="โลโก้" />`
      : `<div class="logo-ph">🏫</div>`;
    const photoTag = photo
      ? `<img src="${photo}" alt="ภาพปก" />`
      : `<div class="bg-ph">🧑‍🏫</div>`;
    html = html.split('[[LOGO]]').join(logoTag);
    html = html.split('[[PHOTO]]').join(photoTag);
    return html;
  }, [genHtml, logo, photo]);

  async function exportImage(fmt) {
    setError('');
    if (!genHtml) {
      setError('กรุณากด "สร้างปก" หรือ "ดูตัวอย่าง" ก่อน');
      return;
    }
    try {
      const { default: html2canvas } = await import('html2canvas');
      if (document.fonts?.ready) await document.fonts.ready;
      const el = coverRef.current;
      const wrap = scaleWrapRef.current;
      const prevTransform = wrap ? wrap.style.transform : '';
      if (wrap) wrap.style.transform = 'none';
      let canvas;
      try {
        canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
          windowWidth: 794,
        });
      } finally {
        if (wrap) wrap.style.transform = prevTransform;
      }
      const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
      const data = canvas.toDataURL(mime, 0.95);
      const a = document.createElement('a');
      const fname = (title || name || 'cover').replace(/[\\/:*?"<>|]/g, '_');
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
        <h2>📕 สร้างปกรายงาน</h2>
        <div className="sub">A4 แนวตั้ง • เปลี่ยนภาพ/โลโก้/ข้อความ ให้ AI ออกแบบให้</div>

        <div className="field">
          <label>ชื่อเรื่อง (ตัวใหญ่สุด)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label>คำบรรยายรอง (เว้นบรรทัดได้)</label>
          <textarea rows={2} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
        <div className="field">
          <label>ช่วง/ครั้งที่</label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="เช่น ครั้งที่ 1 (1 ต.ค. 2569 – 31 มี.ค. 2570)"
          />
        </div>
        <div className="field">
          <label>ชื่อบุคคล</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>หมายเหตุชื่อ</label>
          <input
            type="text"
            value={nameNote}
            onChange={(e) => setNameNote(e.target.value)}
            placeholder="เช่น (นามสมมติ)"
          />
        </div>
        <div className="field">
          <label>ตำแหน่ง</label>
          <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
        <div className="field">
          <label>ชื่อโรงเรียน</label>
          <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        </div>
        <div className="field">
          <label>ข้อมูลสังกัด (เว้นบรรทัดได้)</label>
          <textarea rows={3} value={schoolInfo} onChange={(e) => setSchoolInfo(e.target.value)} />
        </div>
        <div className="field">
          <label>คำคม (มุมล่างขวา)</label>
          <textarea rows={2} value={quote} onChange={(e) => setQuote(e.target.value)} />
        </div>

        <div className="field">
          <label>โลโก้โรงเรียน (PNG/JPG)</label>
          <input type="file" accept="image/png,image/jpeg" onChange={onLogoChange} />
        </div>
        <div className="field">
          <label>ภาพพื้นหลัง/บุคคล (JPG/PNG)</label>
          <input type="file" accept="image/png,image/jpeg" onChange={onPhotoChange} />
          {photo && (
            <div className="thumbs">
              <div className="thumb">
                <img src={photo} alt="ภาพปก" />
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
            placeholder="เช่น โทนน้ำเงินทางการ, สไตล์มินิมอล, ลายไทยหรูหรา"
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
          {loading ? '⏳ AI กำลังออกแบบ...' : '✨ สร้างปก (ใช้ AI)'}
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
          เคล็ดลับ: ใช้ภาพบุคคลแนวตั้งความละเอียดสูงจะสวยที่สุด (ระบบจะจัดภาพเต็มพื้นหลังให้) •
          กด “สร้างปก” ซ้ำเพื่อสุ่มดีไซน์ใหม่ได้
        </div>
      </aside>

      <main className="canvas-area">
        <div
          ref={scaleWrapRef}
          className="a4-scale"
          style={{ transform: `scale(${scale})`, height: 1123 * scale, width: 794 }}
        >
          <div className="cover" ref={coverRef} style={{ '--paper-brand': themeColor }}>
            {finalHtml ? (
              <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
            ) : (
              <div className="banner-empty">
                📕 พรีวิวปกรายงานจะแสดงที่นี่
                <br />
                กรอกข้อมูล แล้วกด “สร้างปก” หรือ “ดูตัวอย่าง”
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
