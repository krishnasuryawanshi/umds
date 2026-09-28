import {
  FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaDownload,
  FaInstagram, FaFacebookF, FaYoutube, FaHome, FaLink, FaInfoCircle,
  FaBoxOpen, FaCreditCard, FaImages, FaCheckCircle, FaIdCard,
  FaCar, FaShieldAlt, FaUserTie, FaFileAlt, FaEllipsisH, FaStar,
  FaShareAlt, FaQrcode, FaClock, FaMotorcycle, FaTruck, FaArrowCircleLeft, FaArrowCircleRight
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from './lib/supabase';
import logo from './assets/logo.png';
import topBanner from './assets/top-banner.png';
import phonepeQr from './assets/phonepe.png';
import gpayQr from './assets/gpay.png';
import paytmQr from './assets/paytm.png';

const phone = '9096588881';
const whatsappText = encodeURIComponent('नमस्कार, मला ड्रायव्हिंग प्रशिक्षणाबद्दल माहिती हवी आहे.');
const mapsUrl = 'https://www.google.com/maps/place/Unhawane+driving+school/@19.9639329,73.7757324,113m/data=!3m1!1e3!4m6!3m5!1s0x3bddeb0f43e43651:0x933fa225c8940eaa!8m2!3d19.9640647!4d73.7754864!16s%2Fg%2F11rnbsh4j2?entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D';
const mapsEmbed = 'https://www.google.com/maps?q=19.9640647,73.7754864&z=17&output=embed';
const facebookUrl = 'https://www.facebook.com/share/1ZaToeJmru/';
const instagramUrl = 'https://www.instagram.com/unhavane_driving_school/';

const ActionButton = ({ href, icon, children, className = '' }) => (
  <a className={`action-btn ${className}`} href={href} target="_blank" rel="noreferrer">{icon}{children}</a>
);

const SectionTitle = ({ children }) => <h2 className="section-title"><span />{children}<span /></h2>;

const services = [
  '4 व्हीलर ड्रायव्हिंग प्रशिक्षण', '2 व्हीलर ड्रायव्हिंग प्रशिक्षण', 'नवीन लायसन्स', 'लायसन्स रिन्युअल',
  'गाडी नावावर करणे', 'गाडी ट्रान्सफर', 'RTO कामे जलद व विश्वासार्ह', 'इन्शुरन्स सेवा',
  'कंडक्टर बॅच', 'ड्रायव्हर बॅच', 'वाहन इन्शुरन्स', 'फिटनेस सर्टिफिकेट', 'टॅक्स संबंधित कामे', 'आधार लिंकिंग / RC अपडेट', 'इतर सर्व RTO सेवा'
];

const packages = [
  { icon: <FaCar />, title: '4 व्हीलर ड्रायव्हिंग प्रशिक्षण', price: '₹ 6,000/-' },
  { icon: <><FaCar /><FaIdCard /></>, title: '4 व्हीलर ड्रायव्हिंग + लायसन्स', price: '₹ 8,000/-' },
  { icon: <><FaMotorcycle /><FaCar /></>, title: '2 व्हीलर + 4 व्हीलर लायसन्स आणि 4 व्हीलर प्रशिक्षण', price: '₹ 9,500/-' },
  { icon: <FaTruck />, title: '4 व्हीलर प्रशिक्षण + 2 व्हीलर लायसन्स + ट्रान्सपोर्ट लायसन्स', price: '₹ 10,500/-' }
];

const rto = [
  [<FaIdCard />, 'नवीन लायसन्स'], [<FaFileAlt />, 'लायसन्स रिन्युअल'], [<FaCar />, 'वाहन ट्रान्सफर'],
  [<FaCar />, 'वाहन पासिंग'], [<FaShieldAlt />, 'इन्शुरन्स सेवा'], [<FaUserTie />, 'ड्रायव्हर बॅच'],
  [<FaUserTie />, 'कंडक्टर बॅच'], [<FaFileAlt />, 'दस्तऐवज / बॅज'], [<FaEllipsisH />, 'इतर RTO सेवा']
];

// gallery images from `public/` (update filenames if you rename files there)
const galleryFiles = Array.from({ length: 25 }, (_, i) => `photo${i + 1}.webp`);

const publicAsset = (filename) => `${import.meta.env.BASE_URL}${filename}`;
const gallery = galleryFiles.map((f, i) => ({ label: `Photo ${i + 1}`, src: publicAsset(f) }));

function GallerySlider({ items = [] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const touchStartRef = useRef(null);
  const touchDeltaRef = useRef(0);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setVisible(w < 640 ? 1 : w < 900 ? 2 : 3);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const prev = () => setIndex(i => (i - visible + items.length) % items.length);
  const next = () => setIndex(i => (i + visible) % items.length);

  const onTouchStart = (e) => {
    touchStartRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaRef.current = 0;
  };

  const onTouchMove = (e) => {
    if (touchStartRef.current == null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaRef.current = x - touchStartRef.current;
  };

  const onTouchEnd = () => {
    const delta = touchDeltaRef.current || 0;
    const thresh = 50; // px
    if (Math.abs(delta) > thresh) {
      if (delta > 0) prev(); else next();
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
  };

  const visibleItems = Array.from({ length: visible }).map((_, i) => items[(index + i) % items.length]);

  return (
    <div className="gallery-slider" style={{ display: 'flex', alignItems: 'center' }}>
      <button className="gs-btn prev" onClick={prev} aria-label="Previous"><FaArrowCircleLeft /></button>
      <div
        className="gs-track"
        style={{ display: 'flex', overflow: 'hidden', width: '100%' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={(e) => { if (touchStartRef.current != null) onTouchMove(e); }}
        onMouseUp={onTouchEnd}
      >
        {visibleItems.map((it, vi) => {
          const globalIndex = (index + vi) % items.length;
          return (
            <div key={it.src} className="gs-item" style={{ flex: `0 0 ${100 / visible}%`, padding: 6 }}>
              <img
                src={encodeURI(it.src)}
                alt={it.label}
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }}
                onClick={() => {
                  const ev = new CustomEvent('gallery-open', { detail: { index: globalIndex } });
                  window.dispatchEvent(ev);
                }}
              />
              <div style={{ textAlign: 'center', marginTop: 6 }}>{it.label}</div>
            </div>
          );
        })}
      </div>
      <button className="gs-btn next" onClick={next} aria-label="Next"><FaArrowCircleRight /></button>
    </div>
  );
}

function Lightbox({ items = [], startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const touchStart = useRef(null);
  const touchDelta = useRef(0);

  useEffect(() => setIdx(startIndex), [startIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length, onClose]);

  if (!items || items.length === 0) return null;

  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);

  const onTouchStart = (e) => {
    touchStart.current = e.touches ? e.touches[0].clientX : e.clientX;
    touchDelta.current = 0;
  };

  const onTouchMove = (e) => {
    if (touchStart.current == null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    touchDelta.current = x - touchStart.current;
  };

  const onTouchEnd = () => {
    const d = touchDelta.current || 0;
    const thresh = 50;
    if (Math.abs(d) > thresh) {
      if (d > 0) prev(); else next();
    }
    touchStart.current = null;
    touchDelta.current = 0;
  };

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">×</button>
        <button className="lightbox-nav prev" onClick={prev} aria-label="Previous">‹</button>
        <img src={encodeURI(items[idx].src)} alt={items[idx].label} className="lightbox-image" />
        <button className="lightbox-nav next" onClick={next} aria-label="Next">›</button>
        <div className="lightbox-caption">{items[idx].label} — {idx + 1}/{items.length}</div>
      </div>
    </div>
  );
}


export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e?.detail?.index != null) {
        setModalIndex(e.detail.index);
        setModalOpen(true);
      }
    };
    window.addEventListener('gallery-open', handler);
    return () => window.removeEventListener('gallery-open', handler);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      const target = document.querySelector('.reviews');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const event = new CustomEvent('admin-review-open');
      window.dispatchEvent(event);
    }
  }, []);
  const share = async () => {
    const data = { title: 'उन्हवने मोटर ड्रायव्हिंग स्कूल', text: 'उन्हवने मोटर ड्रायव्हिंग स्कूलची डिजिटल कार्ड', url: window.location.href };
    if (navigator.share) await navigator.share(data); else navigator.clipboard.writeText(window.location.href);
  };
  // inside App component (or module scope)
  const createVCard = () => `BEGIN:VCARD
VERSION:3.0
FN:उन्हवने मोटर ड्रायव्हिंग स्कूल
TEL;TYPE=WORK,VOICE:${phone}
EMAIL:unhavanemotorschool@gmail.com
ADR:;;शॉप नं. 4, वैष्णवी आर्केड, शांतिनगर हॉटेल जवळ, हसमताळी रोड, पंचवटी, नाशिक - 422003;India
NOTE:उन्हवने मोटर ड्रायव्हिंग स्कूल - Driving School
END:VCARD`;

  const downloadVCard = (filename = 'unhavane.vcf') => {
    const blob = new Blob([createVCard()], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const promos = [
    { text: 'प्रशिक्षित ड्रायव्हर्स उज्ज्वल भविष्यासाठी', img: publicAsset('photo1.webp') },
    { text: 'सुरक्षित ड्रायव्हिंग सुखी भविष्य', img: publicAsset('photo2.webp') },
    { text: 'RTO कामे जलद व विश्वासार्ह', img: publicAsset('photo3.webp') },
    { text: 'योग्य दरात उत्तम सेवा', img: publicAsset('photo4.webp') }
  ];

  return <div className="page-shell">
    <main className="card-page">
      <section id="home" className="profile-card">
        <div className="image-banner">
          <img src={topBanner} alt="उन्हवने मोटर ड्रायव्हिंग स्कूल लोगो" />
        </div>
        <div className="since">Since - 2010</div>
        {/* <div className="brand-top">
          <img src={logo} alt="उन्हवने मोटर ड्रायव्हिंग स्कूल लोगो" />
          <h1>उन्हवने मोटर<br/>ड्रायव्हिंग स्कूल</h1>
          <p>सुरक्षित ड्रायव्हिंग, उज्ज्वल भविष्य</p>
        </div> */}
        <div className="quick-actions">
          <ActionButton href={`tel:${phone}`} icon={<FaPhoneAlt />}>Call</ActionButton>
          <ActionButton className="whatsapp" href={`https://wa.me/91${phone}?text=${whatsappText}`} icon={<FaWhatsapp />}>WhatsApp</ActionButton>
          <ActionButton className="direction" href={mapsUrl} icon={<FaMapMarkerAlt />}>Directions</ActionButton>
          <ActionButton className="email" href="mailto:unhavanemotorschool@gmail.com" icon={<FaEnvelope />}>Email</ActionButton>
        </div>
        <div className="contact-box">
          <p><FaMapMarkerAlt /> शॉप नं. 4, वैष्णवी आर्केड, शांतिनगर हॉटेल जवळ, हसमताळी रोड, पंचवटी, नाशिक - 422003</p>
          <p><FaPhoneAlt /> <a href={`tel:${phone}`}>{phone}</a></p>
          <p><FaEnvelope /> unhavanemotorschool@gmail.com</p>
          <p><FaClock /> सकाळी 7.00 ते रात्री 9.00</p>
          <div className="maps-embed">
            <iframe
              title="Unhawane Driving School"
              src={mapsEmbed}
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-link"><a href={mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></div>
          </div>
          <div className="contact-tools">
            <button onClick={() => downloadVCard()}><FaUserTie /> Add to Phone Book</button>
            <button onClick={() => downloadVCard('unhavane-card.vcf')}><FaDownload /> Save Card</button>
          </div>
        </div>
      </section>

      <section id="links" className="panel">
        <SectionTitle>FOLLOW US</SectionTitle>
        <div className="link-list">
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            <FaMapMarkerAlt />
            <span>
              <b>Location</b>
              <small>Find us on Google Map</small>
            </span>
            ›
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            <FaInstagram />
            <span>
              <b>Instagram</b>
              <small>Follow our journey</small>
            </span>
            ›
          </a>
          <a href={facebookUrl} target="_blank" rel="noreferrer">
            <FaFacebookF />
            <span>
              <b>Facebook</b>
              <small>Like our page</small>
            </span>
            ›
          </a>
          <a href="#"><FaYoutube /><span><b>YouTube</b><small>Subscribe our channel</small></span>›</a>
        </div>
      </section>

      <section id="about" className="panel">
        <SectionTitle>ABOUT US</SectionTitle>
        <div className="about-grid">
          <b>Company Name</b><span>उन्हवने मोटर ड्रायव्हिंग स्कूल</span>
          <b>Category</b><span>Driving School</span>
          <b>Year of Establishment</b><span>2010</span>
          <b>Nature of Business</b><span>मोटर ड्रायव्हिंग प्रशिक्षण व RTO सेवा</span>
        </div>
        <h3>Our Specialities:</h3>
        <ul className="check-list">
          <li>4 व्हीलर व 2 व्हीलर प्रशिक्षण</li>
          <li>सर्व प्रकारचे लायसन्स काढून मिळतात</li>
          <li>RTO संबंधित सर्व कामे तत्परतेने</li>
          <li>अनुभवी प्रशिक्षक व सुरक्षित प्रशिक्षण</li>
          <li>विद्यार्थ्यांसाठी खास मार्गदर्शन</li>
        </ul>
        <p>उन्हवने मोटर ड्रायव्हिंग स्कूलमध्ये आपले हार्दिक स्वागत आहे. आमच्याकडे 4 व्हीलर व 2 व्हीलर गाड्यांचे प्रशिक्षण दिले जाते व सर्व प्रकारची RTO कामे योग्य दरात करून मिळतील.</p>
      </section>

      <section className="panel">
        <SectionTitle>OUR SERVICES</SectionTitle>
        <ul className="service-list">{services.map(s => <li key={s}><FaCheckCircle />{s}</li>)}</ul>
      </section>

      <section id="products" className="panel">
        <SectionTitle>आमचे प्रशिक्षण पॅकेजेस</SectionTitle>
        <div className="package-list">{packages.map((p, i) => <article className="package-card" key={i}>
          <div className="package-icon">{p.icon}</div><div><h3>{p.title}</h3><strong>{p.price}</strong></div>
          <a href={`https://wa.me/91${phone}?text=${encodeURIComponent(p.title + ' बद्दल माहिती हवी आहे')}`}>माहिती घ्या</a>
        </article>)}</div>
      </section>

      <section className="panel">
        <SectionTitle>RTO सेवा</SectionTitle>
        <div className="rto-grid">{rto.map(([icon, label]) => <div key={label}>{icon}<span>{label}</span></div>)}</div>
        <div className="notice">सर्व कामे वेळेत व विश्वासार्ह पद्धतीने योग्य मार्गदर्शनासह पूर्ण केली जातील.</div>
      </section>

      <section className="panel">
        <SectionTitle>PRODUCTS / SERVICES</SectionTitle>
        <div className="promo-grid">
          {promos.map((p, i) => (
            <div className={`promo p${i}`} key={p.text}>
              <div className="promo-img-wrap"><img src={encodeURI(p.img)} alt={p.text} className="promo-img" /></div>
              <span>{p.text}</span>
            </div>
          ))}
        </div>
        <a className="wide-cta" href={`https://wa.me/91${phone}`}>Enquiry</a>
      </section>

      <section id="gallery" className="panel">
        <SectionTitle>OUR GALLERY</SectionTitle>
        <GallerySlider items={gallery} />
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button className="wide-cta" onClick={() => { setModalIndex(0); setModalOpen(true); }}>View All Photos</button>
        </div>
        {modalOpen && <Lightbox items={gallery} startIndex={modalIndex} onClose={() => setModalOpen(false)} />}
      </section>

      <section id="payment" className="panel">
        <SectionTitle>PAYMENT</SectionTitle>
        <div className="payment-grid">
          {[['PhonePe', phonepeQr], ['Google Pay', gpayQr], ['Paytm', paytmQr]].map(([name, qr]) => <div key={name}><b>{name}</b><small>Scan & Pay</small><img src={qr} alt={`${name} QR`} /></div>)}
        </div>
        <div className="upi">UPI ID : 9096588881@upi</div>
      </section>

      <section className="panel">
        <SectionTitle>CUSTOMER REVIEWS</SectionTitle>
        <Reviews phone={phone} />
      </section>

      <section className="panel">
        <SectionTitle>FEEDBACK FORM</SectionTitle>
        <FeedbackForm phone={phone} />
      </section>

      <section className="panel">
        <SectionTitle>ENQUIRY FORM</SectionTitle>
        <EnquiryForm phone={phone} />
      </section>

      <section className="panel share-card">
        <SectionTitle>SHARE THIS CARD</SectionTitle>
        <div className="share-actions"><button onClick={share}><FaShareAlt />Share</button><button><FaQrcode />QR Code</button><button><FaDownload />Save Card</button></div>
        <div className="share-url">https://yourdomain.com/unhavane-school</div>
      </section>
    </main>

    <nav className="bottom-nav">
      <a href="#home"><FaHome /><span>Home</span></a><a href="#links"><FaLink /><span>Links</span></a><a href="#about"><FaInfoCircle /><span>About Us</span></a><a href="#products"><FaBoxOpen /><span>Products</span></a><a href="#payment"><FaCreditCard /><span>Payment</span></a><a href="#gallery"><FaImages /><span>Gallery</span></a>
    </nav>
  </div>
}

function EnquiryForm({ phone }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !service.trim()) {
      alert('कृपया आपले नाव, मोबाईल आणि सेवा निवडा.');
      return;
    }
    const text = `नमस्कार, माझे नाव ${name}. माझा नंबर ${mobile}. मला ${service} बद्दल माहिती हवी. ${message}`;
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    // clear
    setName(''); setMobile(''); setService(''); setMessage('');
  };

  return (
    <form onSubmit={submit} className="enquiry-form">
      <input required value={name} onChange={e => setName(e.target.value)} placeholder="आपले नाव" />
      <input required value={mobile} onChange={e => setMobile(e.target.value)} inputMode="numeric" placeholder="मोबाईल नंबर" />
      <select required value={service} onChange={e => setService(e.target.value)}>
        <option value="" disabled>सेवा निवडा</option>
        <option>4 व्हीलर प्रशिक्षण</option>
        <option>2 व्हीलर प्रशिक्षण</option>
        <option>लायसन्स सेवा</option>
        <option>RTO सेवा</option>
      </select>
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="संदेश लिहा..." />
      <button type="submit">पाठवा</button>
    </form>
  );
}

function FeedbackForm({ phone }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [feedback, setFeedback] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !feedback.trim()) {
      alert('कृपया सर्व फील्ड भरा.');
      return;
    }
    const text = `Feedback from ${name} (${mobile}): ${feedback}`;
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setName(''); setMobile(''); setFeedback('');
  };

  return (
    <form onSubmit={submit} className="feedback-form">
      <input required value={name} onChange={e => setName(e.target.value)} placeholder="आपले नाव" />
      <input required value={mobile} onChange={e => setMobile(e.target.value)} inputMode="numeric" placeholder="मोबाईल नंबर" />
      <textarea required value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="आपला अभिप्राय लिहा..." />
      <button type="submit">सबमिट करा</button>
    </form>
  );
}

function Reviews({ phone }) {
  const STORAGE_KEY = 'unhavane_reviews';
  const supabase = getSupabaseClient();
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const ADMIN_PASSWORD = import.meta.env.VITE_REVIEW_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    const triggerAdmin = () => setAdminPanelOpen(true);
    window.addEventListener('admin-review-open', triggerAdmin);
    return () => window.removeEventListener('admin-review-open', triggerAdmin);
  }, []);

  const makeReviewId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const normalizeReview = (item) => ({
    id: item.id,
    name: item.name,
    rating: Number(item.rating || 5),
    comment: item.comment,
    created_at: item.created_at,
    approved: item.approved !== false
  });

  const saveLocalFallback = (next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    const loadReviews = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            setReviews(data.map(normalizeReview));
            return;
          }
        } catch (err) {
          console.error('Supabase review fetch failed:', err);
        }
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setReviews(Array.isArray(parsed) ? parsed.map(normalizeReview) : []);
        } else {
          const initialReview = {
            id: makeReviewId(),
            name: 'संतोष पाटील',
            rating: 5,
            comment: 'उत्तम प्रशिक्षण व चांगली सेवा. सुलभ मार्गदर्शन, सुरक्षित ड्रायव्हिंग शिकवले.',
            approved: true
          };
          setReviews([initialReview]);
        }
      } catch (e) {
        setReviews([]);
      }
    };

    loadReviews();
  }, [supabase]);

  const publicReviews = reviews.filter(r => r.approved !== false);
  const pendingReviews = reviews.filter(r => r.approved === false);
  const avgRating = publicReviews.length ? (publicReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / publicReviews.length).toFixed(1) : '0.0';

  const approveReview = async (id) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', id);
        if (!error) {
          setReviews(prev => prev.map(item => item.id === id ? { ...item, approved: true } : item));
          return;
        }
      } catch (err) {
        console.error('Supabase approve failed:', err);
      }
    }

    setReviews(prev => prev.map(item => item.id === id ? { ...item, approved: true } : item));
    saveLocalFallback(reviews.map(item => item.id === id ? { ...item, approved: true } : item));
  };

  const rejectReview = async (id) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('reviews').update({ approved: false }).eq('id', id);
        if (!error) {
          setReviews(prev => prev.map(item => item.id === id ? { ...item, approved: false } : item));
          return;
        }
      } catch (err) {
        console.error('Supabase reject failed:', err);
      }
    }

    setReviews(prev => prev.map(item => item.id === id ? { ...item, approved: false } : item));
    saveLocalFallback(reviews.map(item => item.id === id ? { ...item, approved: false } : item));
  };

  const submit = async (e) => {
    e.preventDefault();
    const wordCount = comment.trim().split(/\s+/).filter(Boolean).length;
    if (!name.trim() || !comment.trim()) { alert('कृपया नाव व कमेंट भरा.'); return; }
    if (wordCount < 10) { alert('कृपया किमान 10 शब्दांचा अनुभव लिहा.'); return; }

    const entry = {
      id: makeReviewId(),
      name: name.trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      approved: false
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([{ ...entry, created_at: new Date().toISOString() }])
          .select();

        if (!error && data && data[0]) {
          const saved = normalizeReview(data[0]);
          setReviews(prev => [saved, ...prev]);
          setName('');
          setRating(5);
          setComment('');
          setFlashMessage('Thank you! Your review has been submitted and is awaiting approval.');
          setTimeout(() => setFlashMessage(''), 3200);
          return;
        }
      } catch (err) {
        console.error('Supabase review insert failed:', err);
      }
    }

    const next = [entry, ...reviews];
    setReviews(next);
    saveLocalFallback(next);
    setName('');
    setRating(5);
    setComment('');
    setFlashMessage('Thank you! Your review has been submitted and is awaiting approval.');
    setTimeout(() => setFlashMessage(''), 3200);
  };

  return (
    <div className="reviews">
      <div
        className="review-summary"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}
        onDoubleClick={() => setAdminPanelOpen(true)}
      >
        <div><strong>{publicReviews.length}</strong> approved reviews</div>
        <div><strong>{avgRating}</strong>/5 average rating</div>
      </div>

      <form className="review-form" onSubmit={submit}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="आपले नाव" value={name} onChange={e => setName(e.target.value)} required />
          <select value={rating} onChange={e => setRating(e.target.value)}>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r}★</option>)}
          </select>
        </div>
        <textarea placeholder="आपला अनुभव लिहा..." value={comment} onChange={e => setComment(e.target.value)} required />
        <div className="word-count">Words: {comment.trim() ? comment.trim().split(/\s+/).filter(Boolean).length : 0} (min 10)</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="submit">Submit Review</button>
          <button type="button" onClick={() => { setName(''); setRating(5); setComment(''); }}>Clear</button>
          {flashMessage && <span style={{ color: '#2e7d32', fontSize: 13, fontWeight: 600 }}>{flashMessage}</span>}
        </div>
      </form>

      {adminPanelOpen && (
        <div className="review-admin-panel" style={{ marginTop: 18, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
          {!adminUnlocked ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                style={{ flex: 1, minWidth: 180 }}
              />
              <button type="button" onClick={() => {
                if (adminPassword === ADMIN_PASSWORD) {
                  setAdminUnlocked(true);
                  setAdminPanelOpen(true);
                } else {
                  alert('Incorrect admin password');
                }
                setAdminPassword('');
              }}>Open review queue</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <strong>Review moderation</strong>
                <button type="button" onClick={() => { setAdminUnlocked(false); setAdminPanelOpen(false); }}>Close</button>
              </div>
              {pendingReviews.length === 0 ? (
                <div className="muted">No pending reviews to approve.</div>
              ) : (
                pendingReviews.map(review => (
                  <div key={review.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <strong>{review.name}</strong>
                      <span>{review.rating}★</span>
                    </div>
                    <p style={{ margin: '8px 0' }}>{review.comment}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => approveReview(review.id)}>Approve</button>
                      <button type="button" onClick={() => rejectReview(review.id)}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}

      {publicReviews.length === 0 ? <div className="muted" style={{ marginTop: 12 }}>No reviews yet.</div> : <ReviewSlider reviews={publicReviews} />}
    </div>
  );
}

function ReviewSlider({ reviews = [] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const touchStartRef = useRef(null);
  const touchDeltaRef = useRef(0);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setVisible(w < 640 ? 1 : w < 900 ? 2 : 3);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const prev = () => setIndex(i => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex(i => (i + 1) % reviews.length);

  const onTouchStart = (e) => {
    touchStartRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaRef.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartRef.current == null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaRef.current = x - touchStartRef.current;
  };
  const onTouchEnd = () => {
    const d = touchDeltaRef.current || 0;
    const thresh = 50;
    if (Math.abs(d) > thresh) {
      if (d > 0) prev(); else next();
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
  };

  const visibleItems = Array.from({ length: visible }).map((_, i) => {
    const review = reviews[(index + i) % reviews.length];
    return { ...review, slideKey: `${review.id}-${index + i}` };
  });

  return (
    <div className="review-slider">
      <button className="rs-btn prev" onClick={prev} aria-label="Previous"><FaArrowCircleLeft /></button>
      <div className="rs-track" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseDown={onTouchStart} onMouseMove={(e) => { if (touchStartRef.current != null) onTouchMove(e); }} onMouseUp={onTouchEnd}>
        {visibleItems.map((r, i) => (
          <div key={r.slideKey || `${r.id}-${i}`} className="rs-item">
            <div className="review-item">
              <div className="review-head"><strong>{r.name}</strong><span className="stars">{Array.from({ length: r.rating }).map((_, starIndex) => <FaStar key={`${r.id}-star-${starIndex}`} />)}</span></div>
              <p className="review-body">{r.comment}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="rs-btn next" onClick={next} aria-label="Next"><FaArrowCircleRight /></button>
    </div>
  );
}
