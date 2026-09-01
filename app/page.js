'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase, isSupabaseEnabled } from '@/lib/supabaseClient';
import BannerEditor from './BannerEditor';
import CoverEditor from './CoverEditor';

const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || '044357246';

const PRESET_COLORS = [
  '#0b6b3a', // เขียว
  '#b91c1c', // แดง
  '#c2410c', // ส้มเข้ม (โทนโลโก้)
  '#1d4ed8', // น้ำเงิน
  '#7c3aed', // ม่วง
  '#0891b2', // ฟ้าเทอร์คอยซ์
  '#be185d', // ชมพูเข้ม
  '#374151', // เทาเข้ม
];

// ----- เนื้อหาตัวอย่าง (เดโม) แสดงผลได้โดยไม่ต้องมี API key -----
const SAMPLE = {
  title: '4 ป. ป้องกันไข้เลือดออก',
  content:
    'โรคไข้เลือดออกมียุงลายเป็นพาหะ ป้องกันได้ด้วยการกำจัดแหล่งเพาะพันธุ์ยุงและดูแลตนเอง',
  designPrompt: 'โทนสดใส เหมาะกับนักเรียน แบ่งเป็นการ์ด 4 ข้อ มีไอคอน',
  themeColor: '#0b6b3a',
  html: `<style>
    .ig-content{font-family:'Sarabun','Kanit',sans-serif;color:#1f2937;}
    .ig-content .ig-title{background:var(--paper-brand,#0b6b3a);color:#fff;font-family:'Kanit',sans-serif;font-size:38px;font-weight:800;text-align:center;padding:18px 20px;border-radius:16px;margin-bottom:14px;}
    .ig-content .ig-lead{font-size:20px;text-align:center;color:#374151;margin-bottom:22px;line-height:1.5;}
    .ig-content .ig-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
    .ig-content .ig-card{border:2px solid #eef2f7;border-left:8px solid var(--paper-brand,#0b6b3a);border-radius:14px;padding:18px 20px;background:#fbfdfb;box-shadow:0 4px 12px rgba(0,0,0,.05);}
    .ig-content .ig-card .num{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:var(--paper-brand,#0b6b3a);color:#fff;font-family:'Kanit',sans-serif;font-size:24px;font-weight:800;margin-bottom:10px;}
    .ig-content .ig-card h3{font-family:'Kanit',sans-serif;font-size:24px;color:var(--paper-brand,#0b6b3a);margin-bottom:6px;}
    .ig-content .ig-card p{font-size:18px;line-height:1.55;color:#374151;}
    .ig-content .ig-note{margin-top:22px;background:#fff7ed;border:2px dashed #fb923c;border-radius:14px;padding:16px 20px;font-size:19px;text-align:center;color:#9a3412;font-weight:600;}
  </style>
  <div class="ig-content">
    <div class="ig-title">🦟 4 ป. ป้องกันไข้เลือดออก</div>
    <div class="ig-lead">ยุงลายเป็นพาหะนำโรค เราป้องกันได้ง่าย ๆ ด้วยหลัก 4 ป.</div>
    <div class="ig-cards">
      <div class="ig-card"><div class="num">1</div><h3>🗑️ เปลี่ยน</h3><p>เปลี่ยนน้ำในภาชนะ แจกัน ทุก 7 วัน ไม่ให้ยุงวางไข่</p></div>
      <div class="ig-card"><div class="num">2</div><h3>🧹 ปิด</h3><p>ปิดฝาภาชนะเก็บน้ำให้มิดชิด ป้องกันยุงลงไปวางไข่</p></div>
      <div class="ig-card"><div class="num">3</div><h3>♻️ ปล่อย</h3><p>ปล่อยปลากินลูกน้ำในอ่างบัวหรือภาชนะเก็บน้ำ</p></div>
      <div class="ig-card"><div class="num">4</div><h3>🔧 ปรับปรุง</h3><p>ปรับปรุงสิ่งแวดล้อม เก็บกวาดบ้านให้โปร่ง ไม่เป็นที่เกาะพักของยุง</p></div>
    </div>
    <div class="ig-note">💡 หากมีไข้สูงเกิน 2 วัน ควรพบแพทย์ทันที • ด้วยความห่วงใยจากโรงเรียน</div>
  </div>`,
};

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  // ----- ล็อกอิน -----
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ig_unlocked') === '1') setUnlocked(true);
    } catch {}
  }, []);

  function tryUnlock(e) {
    e.preventDefault();
    if (pwd === APP_PASSWORD) {
      setUnlocked(true);
      try {
        sessionStorage.setItem('ig_unlocked', '1');
      } catch {}
    } else {
      setPwdErr('รหัสไม่ถูกต้อง กรุณาลองใหม่');
    }
  }

  if (!unlocked) {
    return (
      <div className="gate">
        <form className="gate-card" onSubmit={tryUnlock}>
          <h1>🏫 สร้างอินโฟกราฟิก A4</h1>
          <p>โรงเรียนวัดทุ่งจาน • กรุณาใส่รหัสเข้าใช้งาน</p>
          <input
            type="password"
            inputMode="numeric"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setPwdErr('');
            }}
            placeholder="• • • • • •"
            autoFocus
          />
          {pwdErr && <div className="gate-err">{pwdErr}</div>}
          <button className="btn btn-primary" type="submit">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    );
  }

  return <AppShell />;
}

function AppShell() {
  const [mode, setMode] = useState('info'); // 'info' = อินโฟกราฟิก A4, 'banner' = ป้ายแสดงความยินดี

  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand">🏫 ระบบสร้างสื่อ โรงเรียน</div>
        <div className="tabs">
          <button
            className={`tab ${mode === 'info' ? 'active' : ''}`}
            onClick={() => setMode('info')}
          >
            📄 อินโฟกราฟิก A4
          </button>
          <button
            className={`tab ${mode === 'banner' ? 'active' : ''}`}
            onClick={() => setMode('banner')}
          >
            🏅 ป้ายแสดงความยินดี
          </button>
          <button
            className={`tab ${mode === 'cover' ? 'active' : ''}`}
            onClick={() => setMode('cover')}
          >
            📕 ปกรายงาน
          </button>
        </div>
      </div>
      {mode === 'info' && <Editor />}
      {mode === 'banner' && <BannerEditor />}
      {mode === 'cover' && <CoverEditor />}
    </div>
  );
}

function Editor() {
  // ----- ส่วนหัวกระดาษ -----
  const [schoolName, setSchoolName] = useState('โรงเรียนวัดทุ่งจาน');
  const [subLine, setSubLine] = useState('สพป.นครราชสีมา เขต 3');
  const [logo, setLogo] = useState(null);

  // ----- เนื้อหา -----
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [designPrompt, setDesignPrompt] = useState('');
  const [themeColor, setThemeColor] = useState('#0b6b3a');
  const [images, setImages] = useState([]); // array ของ dataURL

  // ----- ผลลัพธ์ -----
  const [genHtml, setGenHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [scale, setScale] = useState(1);

  const a4Ref = useRef(null);
  const scaleWrapRef = useRef(null);

  // ปรับ scale ให้กระดาษ A4 พอดีความกว้างจอ
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
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(await readFileAsDataURL(file));
  }

  async function onImagesChange(e) {
    const files = Array.from(e.target.files || []);
    const urls = await Promise.all(files.map(readFileAsDataURL));
    setImages((prev) => [...prev, ...urls]);
    e.target.value = '';
  }

  function removeImage(i) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function loadSample() {
    setError('');
    setSavedMsg('');
    setTitle(SAMPLE.title);
    setContent(SAMPLE.content);
    setDesignPrompt(SAMPLE.designPrompt);
    setThemeColor(SAMPLE.themeColor);
    setGenHtml(SAMPLE.html);
  }

  async function generate() {
    setError('');
    setSavedMsg('');
    if (!title.trim() && !content.trim()) {
      setError('กรุณากรอกอย่างน้อย "เรื่อง" หรือ "เนื้อหา" ก่อน');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          designPrompt,
          themeColor,
          imageCount: images.length,
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

  // แทนที่ตัวยึดรูป [[IMAGE_n]] ด้วยรูปจริง + เก็บรูปที่ยังไม่ถูกใช้ไปต่อท้าย
  const finalHtml = useMemo(() => {
    if (!genHtml) return '';
    let html = genHtml;
    const used = new Array(images.length).fill(false);
    images.forEach((src, i) => {
      const token = `[[IMAGE_${i + 1}]]`;
      if (html.includes(token)) {
        html = html.split(token).join(`<img src="${src}" class="ig-img" alt="รูป ${i + 1}" />`);
        used[i] = true;
      }
    });
    const leftovers = images.filter((_, i) => !used[i]);
    if (leftovers.length) {
      const grid = leftovers
        .map((src) => `<img src="${src}" class="ig-img" alt="รูปประกอบ" />`)
        .join('');
      html += `<div class="leftover-grid">${grid}</div>`;
    }
    return html;
  }, [genHtml, images]);

  async function exportPdf() {
    setError('');
    if (!genHtml) {
      setError('กรุณากด "สร้างอินโฟกราฟิก" ก่อน');
      return;
    }
    try {
      const [{ default: html2canvas }, jspdfMod] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const jsPDF = jspdfMod.jsPDF || jspdfMod.default;
      if (document.fonts?.ready) await document.fonts.ready;
      const el = a4Ref.current;
      // ปิด transform:scale ของพรีวิวชั่วคราว เพื่อให้ export ได้ความละเอียดเต็ม
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
          height: el.scrollHeight,
          windowWidth: 794,
        });
      } finally {
        if (wrap) wrap.style.transform = prevTransform;
      }
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const pageH = 297;
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH, undefined, 'FAST');
      const fname = (title || 'infographic').replace(/[\\/:*?"<>|]/g, '_');
      pdf.save(`${fname}.pdf`);
    } catch (err) {
      setError('สร้าง PDF ไม่สำเร็จ: ' + err.message);
    }
  }

  async function saveToSupabase() {
    if (!isSupabaseEnabled || !supabase) return;
    setSaving(true);
    setSavedMsg('');
    setError('');
    try {
      const { error: e } = await supabase.from('infographics').insert({
        school_name: schoolName,
        sub_line: subLine,
        title,
        content,
        design_prompt: designPrompt,
        theme_color: themeColor,
        html: genHtml,
      });
      if (e) throw e;
      setSavedMsg('บันทึกงานเรียบร้อยแล้ว ✓');
    } catch (err) {
      setError('บันทึกไม่สำเร็จ: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app">
      {/* ---------- แผงควบคุมด้านซ้าย ---------- */}
      <aside className="sidebar">
        <h2>🎨 สร้างอินโฟกราฟิก A4</h2>
        <div className="sub">กรอกข้อมูล แล้วให้ AI ออกแบบให้สวยงาม</div>

        <div className="field">
          <label>ชื่อโรงเรียน (หัวกระดาษ)</label>
          <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        </div>

        <div className="field">
          <label>บรรทัดรอง (เช่น สังกัด/เขต)</label>
          <input type="text" value={subLine} onChange={(e) => setSubLine(e.target.value)} />
        </div>

        <div className="field">
          <label>โลโก้โรงเรียน (PNG/JPG)</label>
          <input type="file" accept="image/png,image/jpeg" onChange={onLogoChange} />
        </div>

        <div className="field">
          <label>เรื่อง (หัวข้อใหญ่)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น 10 วิธีป้องกันไข้เลือดออก"
          />
        </div>

        <div className="field">
          <label>เนื้อหา</label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="พิมพ์เนื้อหาที่ต้องการ เว้นบรรทัด/ขึ้นหัวข้อย่อยได้ตามสะดวก AI จะจัดรูปแบบให้อ่านง่าย"
          />
        </div>

        <div className="field">
          <label>คำสั่งออกแบบ (สไตล์ / สี / อารมณ์)</label>
          <textarea
            rows={3}
            value={designPrompt}
            onChange={(e) => setDesignPrompt(e.target.value)}
            placeholder="เช่น โทนสดใส เหมาะกับเด็กประถม มีการ์ดแบ่งเป็น 4 ขั้นตอน ใช้ไอคอนน่ารัก"
          />
        </div>

        <div className="field">
          <label>สีหลักของธีม</label>
          <div className="row color-row">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            />
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

        <div className="field">
          <label>รูปภาพประกอบ (PNG/JPG • เลือกได้หลายรูป)</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={onImagesChange}
          />
          {images.length > 0 && (
            <div className="thumbs">
              {images.map((src, i) => (
                <div className="thumb" key={i}>
                  <img src={src} alt={`รูป ${i + 1}`} />
                  <button type="button" onClick={() => removeImage(i)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? '⏳ AI กำลังออกแบบ...' : '✨ สร้างอินโฟกราฟิก'}
        </button>

        <button className="btn btn-ghost" onClick={loadSample}>
          👁️ ดูตัวอย่าง (ไม่ต้องใช้ AI)
        </button>

        <div className="btn-row">
          <button className="btn btn-outline" onClick={exportPdf}>
            ⬇️ บันทึกเป็น PDF
          </button>
          {isSupabaseEnabled && (
            <button className="btn btn-ghost" onClick={saveToSupabase} disabled={saving}>
              {saving ? 'กำลังบันทึก...' : '💾 บันทึกงาน'}
            </button>
          )}
        </div>

        {error && <div className="error-box">{error}</div>}
        {savedMsg && (
          <div className="hint" style={{ color: '#059669', fontWeight: 600 }}>
            {savedMsg}
          </div>
        )}

        <div className="hint">
          เคล็ดลับ: ยิ่งเนื้อหาชัดเจนและระบุสไตล์ที่ต้องการ ผลลัพธ์ยิ่งสวย • ถ้ายังไม่ถูกใจ
          กด "สร้างอินโฟกราฟิก" ซ้ำเพื่อสุ่มดีไซน์ใหม่ได้
        </div>
      </aside>

      {/* ---------- พื้นที่พรีวิว A4 ---------- */}
      <main className="canvas-area">
        <div
          ref={scaleWrapRef}
          className="a4-scale"
          style={{ transform: `scale(${scale})`, height: 1123 * scale }}
        >
          <div className="a4" ref={a4Ref} style={{ '--paper-brand': themeColor }}>
            {/* หัวกระดาษ */}
            <div className="ig-header">
              {logo ? (
                <img className="ig-logo" src={logo} alt="โลโก้" />
              ) : (
                <div className="ig-logo-placeholder">โลโก้</div>
              )}
              <div className="ig-school">
                <div className="name">{schoolName}</div>
                {subLine && <div className="subline">{subLine}</div>}
              </div>
            </div>

            {/* เนื้อหา */}
            <div className="ig-content-wrap">
              {finalHtml ? (
                <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
              ) : (
                <div className="empty-hint">
                  📄 พรีวิวกระดาษ A4 จะแสดงที่นี่
                  <br />
                  กรอกข้อมูลด้านซ้าย แล้วกด “สร้างอินโฟกราฟิก”
                </div>
              )}
            </div>

            <div className="ig-footer">
              จัดทำโดย {schoolName} • สร้างด้วยระบบอินโฟกราฟิก AI
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
