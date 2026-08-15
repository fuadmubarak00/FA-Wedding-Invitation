import { useEffect, useRef, useState } from "react";
import "./App.css";

const eventDate = new Date("2027-01-17T09:00:00+07:00");

const people = {
  f: {
    shortName: "Fuad",
    fullName: "Fuad Mubarak",
    initial: "F",
    portraitClass: "male",
    portraitAksara: "ꦥ",
    familyName: "Bapak Hery Nugroho",
    parents: <>Bapak Hery Nugroho<br/>&amp;<br/>Ibu Rahmawati</>,
    childDescription: "Putra pertama dari",
    instagram: "@fuadmuubarak",
  },
  a: {
    shortName: "Arma",
    fullName: "Armaningtyas Utami",
    initial: "A",
    portraitClass: "female",
    portraitAksara: "ꦄ",
    familyName: "Alm. Bapak Sunarto",
    parents: <>Alm. Bapak Sunarto<br/>&amp;<br/>Ibu Feri Setia Sulistiana</>,
    childDescription: "Putri pertama dari",
    instagram: "@arma_tyas",
  },
};

function getCoupleOrder() {
  const route = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  return route === "a" ? [people.a, people.f] : [people.f, people.a];
}

function Icon({ name }) {
  const paths = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M2 9h20M7.5 9C4 9 4 4 7 4c2.5 0 5 5 5 5s2.5-5 5-5c3 0 3 5-.5 5"/></>,
    music: <><path d="M9 18V5l10-2v13M9 9l10-2"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Ornament({ couple }) {
  return <div className="ornament"><span>{couple[0].portraitAksara}</span><i></i><span>{couple[1].portraitAksara}</span></div>;
}

function CoupleNames({ couple, separator = "em" }) {
  const Separator = separator;
  return <>
    <span>{couple[0].shortName}</span>
    <Separator>&amp;</Separator>
    <span>{couple[1].shortName}</span>
  </>;
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState("");
  const [sent, setSent] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef(null);
  const guestName = new URLSearchParams(window.location.search).get("to")?.trim() || "";
  const couple = getCoupleOrder();
  const [firstPerson, secondPerson] = couple;

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = 0.05;
      musicRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, eventDate.getTime() - Date.now());
      setTime({ days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60 });
    };
    tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer);
  }, []);

  const copy = (value, label) => { navigator.clipboard?.writeText(value); setCopied(label); setTimeout(() => setCopied(""), 1800); };
  const startMusic = () => {
    musicRef.current?.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
  };
  const openInvitation = () => {
    window.scrollTo(0, 0);
    startMusic();
    setOpened(true);
  };
  const toggleMusic = () => {
    if (musicRef.current?.paused) {
      musicRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    } else {
      musicRef.current?.pause();
      setMusicPlaying(false);
    }
  };

  return <main>
    <audio ref={musicRef} src="/audio/background.mp3" loop preload="auto" autoPlay />
    {!opened && <section className="cover" onPointerDown={startMusic}>
      <div className="cover-inner">
        <p className="aksara">ꦲꦸꦤ꧀ꦢꦔꦤ꧀</p>
        <p className="eyebrow">The Wedding of</p>
        <h1 className="cover-names">
          <CoupleNames couple={couple} />
        </h1>
        <Ornament couple={couple} />
        <p className="date">17 • 01 • 2027</p>
        <div className="guest"><small>Kepada Yth.</small><strong>{guestName || "Bapak/Ibu/Saudara/i"}</strong><span>di tempat</span></div>
        <button className="primary" onClick={openInvitation}><Icon name="mail"/> Buka Undangan</button>
      </div>
    </section>}

    <div className={opened ? "site visible" : "site"}>
      <button className={`music-toggle ${musicPlaying ? "is-playing" : ""}`} type="button" onClick={toggleMusic} aria-label={musicPlaying ? "Jeda musik" : "Putar musik"} title={musicPlaying ? "Jeda musik" : "Putar musik"}>
        <span className="vinyl-record" aria-hidden="true"><span className="vinyl-label"><Icon name="music"/></span></span>
        <span className="music-status">{musicPlaying ? "Musik aktif" : "Putar musik"}</span>
      </button>
      <header className="hero section-pad">
        <nav><a href="#home" className="brand">{firstPerson.initial}<span>&amp;</span>{secondPerson.initial}</a><div><a href="#mempelai">Mempelai</a><a href="#acara">Acara</a><a href="#kisah">Kisah</a><a href="#rsvp">RSVP</a></div></nav>
        <div className="hero-content" id="home"><p className="aksara">ꦥꦿꦤꦠꦕꦫ</p><p className="eyebrow">Atas rahmat Tuhan Yang Maha Esa</p><h2><CoupleNames couple={couple} separator="i" /></h2><p className="lead">Dengan penuh rasa syukur, kami mengundang Anda untuk menjadi bagian dari hari bahagia kami.</p><a href="#acara" className="primary"><Icon name="calendar"/> Simpan Tanggal</a></div>
        <div className="hero-frame"><div className="gunungan">♠</div><div className="silhouette"><span>{firstPerson.initial}</span><b>&amp;</b><span>{secondPerson.initial}</span></div></div>
      </header>

      <section className="quote section-pad"><Ornament couple={couple}/><blockquote>“Tresna iku dudu mung katon saka mripat, nanging uga saka ati.”</blockquote><p>Cinta bukan hanya terlihat dari mata, tetapi juga dirasakan dari hati.</p></section>

      <section id="mempelai" className="couple section-pad"><p className="eyebrow">Dua insan, satu tujuan</p><h3>Mempelai</h3><div className="couple-grid">
        <article><div className={`portrait ${firstPerson.portraitClass}`}><span>{firstPerson.portraitAksara}</span></div><h4>{firstPerson.fullName}</h4><p>{firstPerson.childDescription}</p><strong>{firstPerson.parents}</strong><a href="#">{firstPerson.instagram}</a></article><br/>
        <div className="amp">&amp;</div><br/>
        <article><div className={`portrait ${secondPerson.portraitClass}`}><span>{secondPerson.portraitAksara}</span></div><h4>{secondPerson.fullName}</h4><p>{secondPerson.childDescription}</p><strong>{secondPerson.parents}</strong><a href="#">{secondPerson.instagram}</a></article>
      </div></section>

      <section className="countdown section-pad"><p className="eyebrow">Menuju hari bahagia</p><h3>Waktu yang Dinanti</h3><div className="timer">{Object.entries(time).map(([k,v]) => <div key={k}><strong>{String(v).padStart(2,"0")}</strong><span>{{days:"Hari",hours:"Jam",minutes:"Menit",seconds:"Detik"}[k]}</span></div>)}</div></section>

      <section id="acara" className="events section-pad"><p className="eyebrow">Rangkaian acara</p><h3>Waktu &amp; Tempat</h3><div className="event-grid">
        <article><Icon name="heart"/><p className="eyebrow">Akad Nikah</p><h4>Minggu, 17 Januari 2027</h4><p>07.00 – 08.00 WIB</p><hr/><strong>Rumah Mempelai Wanita</strong><p>Jl. Samratulangi No. 19<br/>Ngawi</p><a className="outline" href="https://www.google.com/maps?q=-7.4387778,111.4561944" target="_blank" rel="noreferrer"><Icon name="map"/> Lihat Lokasi</a></article>
        <article><Icon name="music"/><p className="eyebrow">Resepsi</p><h4>Minggu, 17 Januari 2027</h4><p>10.00 – 12.00 WIB</p><hr/><strong>Rumah Mempelai Wanita</strong><p>Jl. Samratulangi No. 19<br/>Ngawi</p><a className="outline" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Fuad+dan+Arma&dates=20270117T010000Z/20270117T070000Z" target="_blank"><Icon name="calendar"/> Tambah Kalender</a></article>
      </div></section>

      <section id="kisah" className="story section-pad"><p className="eyebrow">Jejak langkah kami</p><h3>Kisah Cinta</h3><div className="timeline">
        <article><time>2024</time><div><h4>Awal Berjumpa</h4><p>Kami dipertemukan di kantor yang sama. Berawal dari sapaan dan keseharian sederhana, perlahan tumbuh sebuah cerita yang menghangatkan hati.</p></div></article>
        <article><time>2025</time><div><h4>Mengikat Janji</h4><p>Dengan penuh keyakinan, kami mengikat janji di hadapan kedua keluarga untuk melangkah bersama menuju masa depan.</p></div></article>
        <article><time>2026</time><div><h4>Menyiapkan Hari Bahagia</h4><p>Dalam doa dan dukungan orang-orang terkasih, kami memantapkan hati serta menyiapkan awal baru untuk perjalanan kami berdua.</p></div></article>
        <article><time>2027</time><div><h4>Menyatukan Dua Keluarga</h4><p>Kini kami menanti hari ketika kedua keluarga dipersatukan dalam doa, cinta, dan kebahagiaan yang akan kami kenang selamanya.</p></div></article>
      </div></section>

      <section className="gallery section-pad"><p className="eyebrow">Kenangan yang tersimpan</p><h3>Galeri Kami</h3><div className="photo-grid">
        <div className="photo p1"><img src="/images/gallery/foto-1.avif" alt="Kenangan Fuad dan Arma 1" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }}/><span></span></div>
        <div className="photo p2"><img src="/images/gallery/foto-2.avif" alt="Kenangan Fuad dan Arma 2" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }}/><span></span></div>
        <div className="photo p3"><img src="/images/gallery/foto-3.avif" alt="Kenangan Fuad dan Arma 3" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }}/><span></span></div>
        <div className="photo p4"><img src="/images/gallery/foto-4.avif" alt="Kenangan Fuad dan Arma 4" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }}/><span></span></div>
        <div className="photo p5"><img src="/images/gallery/foto-5.avif" alt="Kenangan Fuad dan Arma 5" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }}/><span></span></div>
      </div>
      {/* <p className="note">Tambahkan foto JPG Anda ke folder <code>public/images/gallery</code>. Foto dimuat saat pengunjung mendekati galeri.</p> */}
      </section>

      <section id="rsvp" className="rsvp section-pad"><div className="form-card"><p className="eyebrow">Konfirmasi kehadiran</p><h3>RSVP &amp; Ucapan</h3>{sent ? <div className="success"><span>✓</span><h4>Matur nuwun!</h4><p>Konfirmasi dan doa baik Anda telah kami terima.</p></div> : <form onSubmit={(e)=>{e.preventDefault();setSent(true)}}><label>Nama lengkap<input required placeholder="Tuliskan nama Anda"/></label><label>Konfirmasi kehadiran<select required defaultValue=""><option value="" disabled>Pilih jawaban</option><option>Ya, saya akan hadir</option><option>Maaf, saya tidak dapat hadir</option></select></label><label>Jumlah tamu<select><option>1 orang</option><option>2 orang</option></select></label><label>Ucapan &amp; doa<textarea required rows={4} placeholder="Tuliskan doa terbaik Anda..."/></label><button className="primary" type="submit">Kirim Konfirmasi</button></form>}</div></section>

      <section className="gift section-pad"><Icon name="gift"/><p className="eyebrow">Tanda kasih</p><h3>Wedding Gift</h3><p>Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberikan tanda kasih, dapat melalui:</p><div className="bank-grid"><div><small>Bank Central Asia</small><strong>1234 5678 9012</strong><span>a.n. Fuad Mubarak</span><button onClick={()=>copy("123456789012","BCA")}>{copied==="BCA"?"Tersalin ✓":"Salin Nomor"}</button></div><div><small>Bank Mandiri</small><strong>9876 5432 1098</strong><span>a.n. Armaningtyas Utami</span><button onClick={()=>copy("987654321098","Mandiri")}>{copied==="Mandiri"?"Tersalin ✓":"Salin Nomor"}</button></div></div></section>

      <footer><p className="aksara">ꦩꦠꦸꦂꦤꦸꦮꦸꦤ꧀</p><h3>Matur Nuwun</h3><p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p><h2><CoupleNames couple={couple} separator="i" /></h2><small>Keluarga Besar {firstPerson.familyName} <br/>&amp;<br/>Keluarga Besar {secondPerson.familyName}</small></footer>
    </div>
  </main>;
}
