'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function InvitacionBodaCompleta() {
  const searchParams = useSearchParams();
  const idInvitado = searchParams.get('id') || 'familia-test';
  
  // Referencia y estado para la música
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicaReproduciendo, setMusicaReproduciendo] = useState(false);

  const toggleMusica = () => {
    if (audioRef.current) {
      if (musicaReproduciendo) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setMusicaReproduciendo(!musicaReproduciendo);
    }
  };

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzOFok20FOkOAAGDAAqehemX7s5DpzGB61ODiqlXJpDzJ7_ygVC0-oyrZUDbAcrBSWJ/exec';

  const urlEmbedMisa = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.6142200534828!2d-86.8501739!3d21.167745600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2c70e5d6ae5b%3A0x72ea25b12d071d0b!2sParroquia%20De%20Corpus%20Christi!5e0!3m2!1ses!2smx!4v1779507604605!5m2!1ses!2smx"; 
  const urlNormalMisa = "https://maps.app.goo.gl/TKYhFzv3ZwqVsQvJ8";
  const urlEmbedFiesta = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14886.295238520886!2d-86.915514!3d21.129551!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4dd53daa24c5f7%3A0xc6dbabfab14ac7d5!2sFinca%20San%20Carlos!5e0!3m2!1ses!2smx!4v1779507925716!5m2!1ses!2smx";
  const urlNormalFiesta = "https://maps.app.goo.gl/23oAneMw961FqE1h9";

  const fotosCarrusel = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1465495910483-04104d568f0d?auto=format&fit=crop&q=80&w=600"
  ];

  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, minutes: 0, segundos: 0 });
  const [nombreInvitado, setNombreInvitado] = useState('');
  const [pasesTotales, setPasesTotales] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mapaActivo, setMapaActivo] = useState<'misa' | 'fiesta'>('misa');
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === fotosCarrusel.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? fotosCarrusel.length - 1 : prev - 1));

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  useEffect(() => {
    const fechaBoda = new Date('2026-10-24T18:00:00').getTime();
    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const distancia = fechaBoda - ahora;
      if (distancia < 0) clearInterval(intervalo);
      else {
        setTiempo({
          dias: Math.floor(distancia / (1000 * 60 * 60 * 24)),
          horas: Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((distancia % (1000 * 60 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    async function obtenerDatos() {
      try {
        const respuesta = await fetch(`${WEB_APP_URL}?id=${idInvitado}`);
        const resultado = await respuesta.json();
        if (resultado.estatus === 'encontrado') {
          setNombreInvitado(resultado.datos.invitado);
          setPasesTotales(Number(resultado.datos.pases_totales));
        } else {
          setNombreInvitado('Invitado Especial');
          setPasesTotales(2);
        }
      } catch (error) {
        setNombreInvitado('Invitado Especial');
        setPasesTotales(2);
      } finally {
        setCargando(false);
      }
    }
    obtenerDatos();
  }, [idInvitado, WEB_APP_URL]);

  async function manejarConfirmacion() {
    setEnviando(true);
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idInvitado, pases_confirmados: pasesTotales })
      });
      alert(`¡Muchas gracias! Confirmación guardada con éxito.`);
    } catch (error) {
      alert("Hubo un error. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const descargarCalendarioICS = () => {
    const calendarioContenido = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "DTSTART:20261024T190000",
      "DTEND:20261025T030000", "SUMMARY:Nuestra Boda 🤵👰", "LOCATION:Parroquia De Corpus Christi, México",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\n");
    const blob = new Blob([calendarioContenido], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'boda_evento.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-4 font-sans relative flex flex-col items-center justify-center">
      
      {/* SECCIÓN MÚSICA */}
      <audio ref={audioRef} src="/musica-boda.mp3" loop />
      <button 
        onClick={toggleMusica}
        className="fixed top-4 right-4 z-50 bg-[#4a1820] text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        {musicaReproduciendo ? '🎵' : '🔇'}
      </button>

      {/* Fondo con flores sutiles */}
      <div className="fixed inset-0 opacity-[0.08] pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/floral-pattern.png"), radial-gradient(#4a1820 1px, transparent 1px)', backgroundSize: '200px, 40px 40px' }}>
      </div>
      
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border-t-8 border-[#4a1820] relative z-10">
        
        <h1 className="text-3xl font-serif text-[#4a1820] mb-0.5">Claudia & Javier</h1>
        <p className="text-xl font-serif text-[#881337] mb-1 font-semibold tracking-wide">Nuestra Boda</p>
        <p className="text-xs text-stone-500 uppercase tracking-widest mb-4 font-medium">¡Nos casamos!</p>
        
        <div className="w-full border-t border-b border-[#4a1820]/20 py-2.5 mb-6 flex items-center justify-center gap-4">
          <span className="text-xs uppercase text-stone-500 tracking-wider font-semibold">Sábado</span>
          <span className="text-xl font-serif font-bold text-[#4a1820] border-l border-r border-[#4a1820]/20 px-4">24 . OCT . 2026</span>
          <span className="text-xs uppercase text-stone-500 tracking-wider font-semibold">07:00 PM</span>
        </div>

        <div className="w-full mb-8">
          <div className="w-full h-52 rounded-2xl overflow-hidden shadow-md border border-stone-100 bg-stone-50 mb-6">
            <img src="/foto-pareja.jpg" alt="Nuestra Unión" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600"; }} />
          </div>
          <p className="text-sm italic text-stone-600 px-4 leading-relaxed">
            "sean sus vidas tan unidas en amor que lleguen a ser una sola alma; y así, nada en el mundo podrá separarlos"
            <br /><span className="font-semibold text-[#4a1820] not-italic block mt-1">— Mateo 19:6</span>
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center mb-4 w-full">
          {Object.entries({ Días: tiempo.dias, Hrs: tiempo.horas, Min: tiempo.minutes, Seg: tiempo.segundos }).map(([label, value]) => (
            <div key={label} className="bg-[#4a1820]/5 py-3 rounded-xl border border-[#4a1820]/10">
              <span className="text-xl font-bold text-[#4a1820] block">{value}</span>
              <span className="text-[9px] uppercase text-stone-500 tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        <button onClick={descargarCalendarioICS} className="mb-8 inline-flex items-center gap-2 bg-[#4a1820] hover:bg-[#881337] text-white text-[11px] font-bold py-2 px-4 rounded-xl transition-colors duration-200 shadow-sm uppercase tracking-wider">
          📅 Guardar fecha en mi calendario
        </button>

        <div className="w-full mb-8">
          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-[#4a1820]/10 bg-stone-100 group">
            {fotosCarrusel.map((url, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <img src={url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/80 p-2 rounded-full backdrop-blur-sm transition-all shadow-md">◀</button>
            <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/80 p-2 rounded-full backdrop-blur-sm transition-all shadow-md">▶</button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {fotosCarrusel.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-[#4a1820] w-6' : 'bg-white/70'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-stone-50 p-6 rounded-2xl mb-6 border border-stone-200 text-left">
          <p className="text-[10px] font-bold text-stone-600 mb-6 uppercase tracking-widest">⏳ Itinerario de la Noche</p>
          <div className="relative border-l border-[#4a1820]/30 ml-3 pl-6 space-y-8">
            {[
              { icon: '⛪', title: 'Ceremonia Religiosa', time: '07:00 PM', desc: 'Parroquia De Corpus Christi.' },
              { icon: '🥂', title: 'Recepción', time: '09:00 PM', desc: 'Brindis de bienvenida.' },
              { icon: '🍽️', title: 'Banquete / Cena', time: '', desc: 'Momento de disfrutar el banquete.' },
              { icon: '🎉', title: '¡A bailar!', time: '', desc: 'Apertura de pista.' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-0.5 bg-[#4a1820] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] ring-4 ring-stone-50">{item.icon}</span>
                <h4 className="text-xs font-serif font-bold text-[#4a1820] uppercase tracking-wide">{item.title}</h4>
                {item.time && <p className="text-[11px] font-bold text-stone-700">{item.time}</p>}
                <p className="text-[11px] text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-stone-50 p-4 rounded-2xl mb-6 border border-stone-200">
          <div className="flex bg-stone-200/60 p-1 rounded-xl mb-3">
            <button onClick={() => setMapaActivo('misa')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${mapaActivo === 'misa' ? 'bg-[#4a1820] text-white' : 'text-stone-600'}`}>⛪ Ceremonia</button>
            <button onClick={() => setMapaActivo('fiesta')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${mapaActivo === 'fiesta' ? 'bg-[#4a1820] text-white' : 'text-stone-600'}`}>🥂 Recepción</button>
          </div>
          <div className="overflow-hidden rounded-xl h-44 w-full bg-stone-100 border border-stone-200">
            <iframe src={mapaActivo === 'misa' ? urlEmbedMisa : urlEmbedFiesta} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
          </div>
          <a href={mapaActivo === 'misa' ? urlNormalMisa : urlNormalFiesta} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[#4a1820] text-[10px] font-bold py-2 px-4 bg-[#4a1820]/10 rounded-lg">🗺️ Abrir en Google Maps</a>
        </div>

        <div className="w-full bg-stone-50 p-5 rounded-2xl mb-6 border border-stone-200 text-center">
          <p className="text-[10px] font-bold text-stone-600 mb-2 uppercase tracking-widest text-left">👗 Código de Vestimenta</p>
          <h4 className="text-md font-serif font-bold text-[#4a1820] tracking-wide mb-1">Semi-formal elegante / Fresco</h4>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-200 text-left">
            <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
              <p className="text-xs font-bold text-[#4a1820] uppercase mb-2">💃 Damas</p>
              <p className="text-[11px] text-stone-700 mb-2">Vestido largo elegante.</p>
              <p className="text-[10px] font-medium text-red-800 bg-red-50 p-1 rounded italic">🚫 Evitar: Blanco, Rojo Vino, Azul Marino.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
              <p className="text-xs font-bold text-[#4a1820] uppercase mb-2">🤵 Caballeros</p>
              <p className="text-[11px] text-stone-700 mb-2">Camisa y pantalón de vestir.</p>
              <p className="text-[10px] font-medium text-red-800 bg-red-50 p-1 rounded italic">🚫 Evitar: Azul Marino, Gris, Rojo Vino.</p>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#4a1820]/5 p-6 rounded-2xl border border-[#4a1820]/10 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-[#4a1820] mb-2">Confirmar Asistencia</h3>
          {cargando ? (
            <p className="text-xs text-stone-400 animate-pulse">Preparando...</p>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-xl font-serif italic text-[#4a1820]">Querido(a) {nombreInvitado},</p>
              </div>
              <div className="pt-4 border-t border-[#4a1820]/10">
                <div className="bg-white p-4 rounded-xl border border-[#4a1820]/10 mb-4 shadow-sm">
                  <p className="text-[11px] text-stone-500 uppercase tracking-widest font-bold mb-1">Lugares reservados para ustedes:</p>
                  <p className="text-3xl font-serif font-bold text-[#4a1820]">{pasesTotales} {pasesTotales === 1 ? 'Persona' : 'Personas'}</p>
                </div>
                <button onClick={manejarConfirmacion} disabled={enviando} className="w-full bg-[#4a1820] hover:bg-[#881337] text-white font-bold text-xs py-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 uppercase tracking-widest mb-4">
                  {enviando ? 'Confirmando...' : 'Confirmar asistencia'}
                </button>
                <div className="text-center mt-2 border-t border-[#4a1820]/10 pt-4">
                  <p className="text-sm font-serif italic text-[#4a1820] mb-1">"Esperamos contar con su presencia"</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Muchas gracias.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center">Cargando...</div>}>
      <InvitacionBodaCompleta />
    </Suspense>
  );
}