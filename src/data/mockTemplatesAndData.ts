import { BusinessCategory, AudioTrack, AIVoice, AnimatedTemplate, EducationLesson, MediaItem } from '../types';

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'otro_negocio',
    name: 'OTRO TIPO DE NEGOCIO',
    iconName: 'Sparkles',
    description: 'Personaliza tu negocio exactamente como lo imaginas (servicios, industria, emprendimientos únicos).',
    recommendedTone: 'Persuasivo y adaptado al cliente',
    sampleIdea: 'Servicio exclusivo a domicilio con atención personalizada y garantía total.',
    keywords: ['especial', 'personalizado', 'innovador', 'unico', 'servicio']
  },
  {
    id: 'restaurante',
    name: 'Gastronomía & Restaurantes',
    iconName: 'Utensils',
    description: 'Comida rápida, cafeterías, repostería, gourmet, pizzerías y bares.',
    recommendedTone: 'Apetitoso, cercano y provocador de antojos',
    sampleIdea: '¡Este fin de semana 2x1 en nuestras hamburguesas artesanales con papas rústicas gratis!',
    keywords: ['delicioso', 'sabor', 'antojo', 'artesanal', 'combo', 'delivery']
  },
  {
    id: 'moda',
    name: 'Moda, Ropa & Calzado',
    iconName: 'ShoppingBag',
    description: 'Boutiques, ropa urbana, vestidos, accesorios, calzado y joyas.',
    recommendedTone: 'Elegante, en tendencia y aspiracional',
    sampleIdea: 'Nueva colección de temporada. Prendas exclusivas diseñadas para destacar tu estilo único.',
    keywords: ['tendencia', 'outfit', 'coleccion', 'estilo', 'moda', 'elegancia']
  },
  {
    id: 'belleza',
    name: 'Belleza, Barbería & Spa',
    iconName: 'Scissors',
    description: 'Salones de belleza, barberías premium, spa, uñas acrílicas y cuidado de la piel.',
    recommendedTone: 'Relajante, estético y de autocuidado',
    sampleIdea: 'Renueva tu look este mes con nuestro combo especial de corte + barba y tratamiento capilar.',
    keywords: ['cuidado', 'imagen', 'relax', 'cambiodelook', 'brillo', 'belleza']
  },
  {
    id: 'fitness',
    name: 'Fitness, Gimnasio & Salud',
    iconName: 'Dumbbell',
    description: 'Gimnasios, entrenadores personales, crossfit, yoga y nutrición.',
    recommendedTone: 'Motivador, enérgico y transformador',
    sampleIdea: 'Inscríbete hoy y entrena todo el primer mes con 50% de descuento. ¡Alcanza tu mejor versión!',
    keywords: ['energia', 'salud', 'transformacion', 'fuerza', 'disciplina', 'reto']
  },
  {
    id: 'inmobiliaria',
    name: 'Bienes Raíces & Inmobiliaria',
    iconName: 'Home',
    description: 'Venta de casas, apartamentos, alquileres, oficinas y terrenos.',
    recommendedTone: 'Confiable, seguro y de alto valor patrimonial',
    sampleIdea: 'El hogar de tus sueños te espera. Apartamentos con acabados de lujo y entrega inmediata.',
    keywords: ['inversion', 'hogar', 'vivienda', 'oportunidad', 'patrimonio', 'estilodevida']
  },
  {
    id: 'tecnologia',
    name: 'Tecnología & Reparaciones',
    iconName: 'Smartphone',
    description: 'Venta de celulares, computadores, accesorios y servicio técnico garantizado.',
    recommendedTone: 'Moderno, rápido y confiable',
    sampleIdea: '¿Pantalla rota o batería lenta? Reparación express en 45 minutos con repuestos originales.',
    keywords: ['rapido', 'garantia', 'tecnologia', 'calidad', 'reparacion', 'soporte']
  },
  {
    id: 'automotriz',
    name: 'Automotriz, Mecánica & Car Wash',
    iconName: 'Car',
    description: 'Talleres mecánicos, autolavados, repuestos, polarizados y cambio de aceite.',
    recommendedTone: 'Técnico, garantizado y preventivo',
    sampleIdea: 'Mantenimiento preventivo completo para tu vehículo antes de viajar. ¡Seguridad para tu familia!',
    keywords: ['motor', 'seguridad', 'mantenimiento', 'detallado', 'repuestos', 'confianza']
  },
  {
    id: 'mascotas',
    name: 'Mascotas & Veterinaria',
    iconName: 'HeartHandshake',
    description: 'Clínicas veterinarias, grooming canino, alimentos y accesorios para mascotas.',
    recommendedTone: 'Cálido, protector y lleno de ternura',
    sampleIdea: 'Dale a tu consentido el mejor baño relajante y corte con productos orgánicos especiales.',
    keywords: ['peludos', 'amorcanino', 'veterinaria', 'consentidos', 'cuidadoanimal']
  },
  {
    id: 'educacion',
    name: 'Educación, Cursos & Clases',
    iconName: 'GraduationCap',
    description: 'Academias, cursos online, idiomas, tutorías y formación profesional.',
    recommendedTone: 'Inspirador, didáctico y enfocado en resultados futuros',
    sampleIdea: 'Aprende inglés conversacional en 6 meses con nuestro método 100% práctico desde tu móvil.',
    keywords: ['aprendizaje', 'futuro', 'certificacion', 'habilidades', 'exito']
  },
  {
    id: 'servicios_profesionales',
    name: 'Servicios Legales, Contables & Consultoría',
    iconName: 'Briefcase',
    description: 'Abogados, contadores, asesorías contables, consultores de negocios y marketing.',
    recommendedTone: 'Autoridad, formalidad y alta confidencialidad',
    sampleIdea: 'Optimiza tus finanzas y cumple con tus obligaciones tributarias sin estrés ni multas.',
    keywords: ['asesoria', 'seguridadlegal', 'tranquilidad', 'gestion', 'negocios']
  },
  {
    id: 'artesanias_regalos',
    name: 'Artesanías, Floristería & Regalos',
    iconName: 'Gift',
    description: 'Arreglos florales, detalles personalizados, manualidades y regalos sorpresa.',
    recommendedTone: 'Emocional, detallista y memorable',
    sampleIdea: 'Sorprende a esa persona especial hoy con una caja personalizada de rosas y chocolates finos.',
    keywords: ['sorpresa', 'amor', 'detalles', 'momentos', 'personalizado']
  }
];

export const SAMPLE_DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'sample-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&q=80',
    name: 'Plato_Gourmet_Especial.jpg',
    aspectRatio: '9:16'
  },
  {
    id: 'sample-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1080&q=80',
    name: 'Boutique_Moda_Exclusiva.jpg',
    aspectRatio: '9:16'
  },
  {
    id: 'sample-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1080&q=80',
    name: 'Estetica_Belleza_Spa.jpg',
    aspectRatio: '9:16'
  },
  {
    id: 'sample-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1080&q=80',
    name: 'Fitness_Entrenamiento_Activo.jpg',
    aspectRatio: '9:16'
  }
];

export const ROYALTY_FREE_TRACKS: AudioTrack[] = [
  {
    id: 'track_energetic_commercial',
    title: 'Upbeat Pop Comercial (Ideal Ventas y Reels)',
    category: 'Ventas Dinámicas',
    duration: '0:30',
    url: 'https://cdn.freesound.org/previews/573/573641_11861866-lq.mp3'
  },
  {
    id: 'track_cinematic_ambient',
    title: 'Cinematic Ambient (Elegancia & Bienes Raíces)',
    category: 'Cinemático & Lujo',
    duration: '0:35',
    url: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3'
  },
  {
    id: 'track_urban_lofi',
    title: 'Urban Lo-Fi Beat (Moda, Cafés & Jóvenes)',
    category: 'Tendencia Juvenil',
    duration: '0:28',
    url: 'https://cdn.freesound.org/previews/608/608253_11861866-lq.mp3'
  },
  {
    id: 'track_corporate_motivation',
    title: 'Corporativo & Éxito (Servicios & Tecnología)',
    category: 'Confianza & Éxito',
    duration: '0:32',
    url: 'https://cdn.freesound.org/previews/536/536108_11861866-lq.mp3'
  }
];

export const AI_VOICES: AIVoice[] = [
  {
    id: 'voice_valentina',
    name: 'Valentina (Presentadora de Lujo & Estilo)',
    avatarRole: 'Moda, Estética, Lujo & Hotelería',
    avatarImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    gender: 'Femenina',
    style: 'Elegante, cálida, refinada y con articulación de alta gama',
    description: 'Voz humana sofisticada ideal para marcas de prestigio, joyería, estética, clínicas y gastronomía gourmet.',
    previewQuote: 'Hola, soy Valentina. Descubre la elegancia y distinción que tu marca merece con nuestra atención exclusiva.',
    recommendedFor: 'Joyería, Estética, Boutiques, Alta Cocina y Hoteles',
    apiVoiceName: 'Zephyr',
    badge: 'Más Elegante',
    accentColor: 'from-amber-500 to-rose-500'
  },
  {
    id: 'voice_mateo',
    name: 'Mateo (Locutor Enérgico & Comercial)',
    avatarRole: 'Tecnología, Reparaciones, Fitness & Autos',
    avatarImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    gender: 'Masculina',
    style: 'Seguro, vibrante, enérgico y con gancho comercial persuasivo',
    description: 'Locución masculina directa y convincente. Perfecta para talleres, servicios técnicos de computadores, concesionarios y gimnasios.',
    previewQuote: '¡Qué tal! Soy Mateo. Potencia tus ventas hoy mismo con soluciones rápidas, garantizadas y al mejor precio.',
    recommendedFor: 'Tecnología, Computadores, Talleres, Fitness y Automotriz',
    apiVoiceName: 'Fenrir',
    badge: 'Más Popular',
    accentColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'voice_andres',
    name: 'Andrés (Locutor Grave & Radio FM)',
    avatarRole: 'Voz de Cine, Tráilers, Autos & Construcción',
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    gender: 'Masculina',
    style: 'Grave, potente, barítono imponente estilo tráiler de cine y radio comercial',
    description: 'Voz de gran impacto y presencia autoritaria. Diseñada para ofertas irresistibles, talleres mecánicos, ferreterías y tecnología pesada.',
    previewQuote: 'Atención: esta es la oportunidad definitiva para renovar tu equipo con potencia absoluta y garantía total.',
    recommendedFor: 'Talleres, Seguridad, Automotriz, Ferretería y Ofertas Top',
    apiVoiceName: 'Orus',
    badge: 'Voz Profunda',
    accentColor: 'from-amber-600 to-red-600'
  },
  {
    id: 'voice_elena',
    name: 'Elena (Narradora Cálida & Confiable)',
    avatarRole: 'Salud, Familia, Mascotas & Hogar',
    avatarImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    gender: 'Femenina',
    style: 'Cálida, serena, natural, cercana y con máxima credibilidad',
    description: 'Tono humano muy natural y empático. Transmite seguridad inmediata en servicios a domicilio, salud, cuidado familiar y mascotas.',
    previewQuote: 'Cuidamos de lo que más valoras con atención profesional, puntual y con la calidez humana que tu familia merece.',
    recommendedFor: 'Salud, Veterinarias, Servicios a Domicilio y Bienestar',
    apiVoiceName: 'Aoede',
    badge: 'Cálida & Natural',
    accentColor: 'from-teal-500 to-emerald-600'
  },
  {
    id: 'voice_diego',
    name: 'Diego (Joven Creador & Tech Reels)',
    avatarRole: 'Gaming, Apps, Comida Rápida & Delivery',
    avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    gender: 'Masculina',
    style: 'Fresco, espontáneo, rápido, estilo YouTuber y TikToker',
    description: 'Locución juvenil masculina dinámica que conecta de inmediato con audiencias jóvenes en Reels, TikTok y YouTube Shorts.',
    previewQuote: '¡Ey qué tal! No te compliques la vida, hoy puedes tener la solución en tus manos de forma rápida y sencilla.',
    recommendedFor: 'Comida Rápida, Startups, Gaming, Celulares y Delivery',
    apiVoiceName: 'Puck',
    badge: 'TikTok Dinámico',
    accentColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'voice_lucia',
    name: 'Lucía (Locutora Promocional & Retail)',
    avatarRole: 'Supermercados, Ofertas Flash & Liquidaciones',
    avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    gender: 'Femenina',
    style: 'Chispeante, alegre, persuasiva y enfocada en descuentos',
    description: 'Cadencia comercial entusiasta para comunicar promociones irresistibles, ofertas del fin de semana y cupones especiales.',
    previewQuote: '¡Aprovecha hoy mismo! Precios especiales por tiempo limitado, escríbenos ya y asegura tu descuento.',
    recommendedFor: 'Supermercados, Moda, Ofertas Relámpago y Belleza',
    apiVoiceName: 'Leda',
    badge: 'Promociones Flash',
    accentColor: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'voice_camila',
    name: 'Camila (Creadora Digital & TikTok UGC)',
    avatarRole: 'Tendencias, Reels, Gastronomía & Eventos',
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    gender: 'Femenina',
    style: 'Fresca, cercana, juvenil y con ritmo orgánico de redes sociales',
    description: 'Estilo creadora de contenido (UGC). Conecta de inmediato con audiencias jóvenes en TikTok, Instagram Reels y WhatsApp Stories.',
    previewQuote: '¡Hola a todos, soy Camila! No dejes pasar esta súper oportunidad con ofertas exclusivas en redes sociales.',
    recommendedFor: 'Comida Rápida, Moda Juvenil, Ofertas Flash y Eventos',
    apiVoiceName: 'Puck',
    badge: 'Viral Reels',
    accentColor: 'from-pink-500 to-purple-600'
  },
  {
    id: 'voice_alejandro',
    name: 'Alejandro (Locutor Sénior & Confianza)',
    avatarRole: 'Corporativo, Inmobiliaria, Salud & Legal',
    avatarImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    gender: 'Masculina',
    style: 'Grave, institucional, sereno y que proyecta máxima autoridad',
    description: 'Tono barítono de locución clásica. Inspira seriedad y tranquilidad en servicios profesionales, inmobiliarias y firmas de abogados.',
    previewQuote: 'Estimado cliente, soy Alejandro. Respaldamos su confianza con excelencia profesional y máxima seguridad jurídica.',
    recommendedFor: 'Bienes Raíces, Consultoría, Finanzas, Abogados y Salud',
    apiVoiceName: 'Charon',
    badge: 'Institucional',
    accentColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'voice_sofia',
    name: 'Sofía (Asesora Comercial & Ventas)',
    avatarRole: 'Promociones Flash, WhatsApp & Retail',
    avatarImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    gender: 'Femenina',
    style: 'Entusiasta, rápida, alegre y orientada a cerrar ventas ya',
    description: 'Cadencia comercial activa para comunicar promociones de última hora, liquidaciones de inventario y llamados directos a WhatsApp.',
    previewQuote: '¡Aprovecha hoy mismo! Soy Sofía y tenemos promociones especiales por tiempo limitado en WhatsApp.',
    recommendedFor: 'Tiendas, Bazares, Supermercados y WhatsApp Business',
    apiVoiceName: 'Kore',
    badge: 'Ventas Rápidas',
    accentColor: 'from-amber-600 to-orange-500'
  }
];

export const ANIMATED_TEMPLATES: AnimatedTemplate[] = [
  {
    id: 'kenburns',
    name: 'Zoom Cinematográfico (Ken Burns)',
    description: 'Acercamiento continuo con paneo suave que da sensación de cine profesional a fotos estáticas.',
    badge: 'Más Usado',
    previewBg: 'from-amber-600 to-orange-700',
    transitionType: 'Escalado suave con movimiento diagonal 1.0x -> 1.18x'
  },
  {
    id: 'neonpulse',
    name: 'Pulso Neón & Ritmo Dinámico',
    description: 'Transición rítmica con destellos de luz brillante pensada para captar la atención en TikTok e Instagram.',
    badge: 'Viral Reels',
    previewBg: 'from-fuchsia-600 to-indigo-700',
    transitionType: 'Destello de exposición con salto dinámico de cámara'
  },
  {
    id: 'elegantfade',
    name: 'Lujo & Desvanecido Minimalista',
    description: 'Disolución cruzada cinematográfica con viñeta de luz suave para marcas premium.',
    badge: 'Premium',
    previewBg: 'from-slate-800 to-zinc-950',
    transitionType: 'Crossfade suave con desenfoque gaussiano inicial'
  },
  {
    id: 'glitchurban',
    name: 'Impacto Urbano & Movimiento Veloz',
    description: 'Cortes rápidos con micro-vibración y tipografías enérgicas ideales para promociones de acción.',
    badge: 'Acción',
    previewBg: 'from-rose-600 to-violet-800',
    transitionType: 'Desplazamiento horizontal rápido con aceleración elástica'
  },
  {
    id: 'storyzoom',
    name: 'Storyteller 9:16 Vertical',
    description: 'Efecto envolvente que destaca el producto en el centro de la pantalla móvil con marco publicitario.',
    badge: 'Stories & Shorts',
    previewBg: 'from-emerald-600 to-teal-800',
    transitionType: 'Zoom in y out pendular continuo con rebote sutil'
  }
];

export const EDUCATION_LESSONS: EducationLesson[] = [
  {
    id: 'lesson_mobile_photo',
    category: 'Diseño Móvil',
    title: 'Cómo tomar fotos de catálogo profesional con tu celular',
    readTimeMinutes: 3,
    summary: 'No necesitas cámaras de miles de dólares; el 90% del éxito en fotos para publicidad depende de la iluminación y la limpieza de la lente.',
    bulletPoints: [
      'Limpia SIEMPRE el lente de la cámara con una prenda de algodón suave antes de disparar.',
      'Usa luz natural indirecta: colócate a 90 grados de una ventana grande o en exteriores a la sombra.',
      'Activa la cuadrícula 3x3 en los ajustes de tu cámara y ubica tu producto en las intersecciones (regla de los tercios).',
      'Evita el zoom digital porque pixela la foto; en su lugar, acerca físicamente el celular al producto o usa el lente 2x óptico.',
      'Toca en la pantalla del celular sobre el producto para fijar el enfoque y desliza un poco hacia abajo para que los colores no se quemen.'
    ],
    proTip: 'Toma fotos desde el ángulo en el que el cliente consume el producto (ejemplo: a 45 grados para un plato de comida).'
  },
  {
    id: 'lesson_3s_hook',
    category: 'Copywriting',
    title: 'La fórmula de los 3 segundos: Ganchos que detienen el scroll',
    readTimeMinutes: 4,
    summary: 'Un usuario en el celular tarda solo 1.8 segundos en decidir si pasa de largo tu video o se queda a mirarlo. Empieza con el beneficio, nunca con tu nombre.',
    bulletPoints: [
      'Error común fatal: Empezar con "Hola amigos, hoy les venimos a presentar nuestra empresa...". La gente ya hizo scroll.',
      'Fórmula Gancho: "¿Sabías que el 80% de las personas comete este error al...?" o "Si tienes un negocio, deja de hacer esto hoy mismo".',
      'Fórmula Beneficio Directo: "Cómo lograr [Resultado deseado] en menos de [Tiempo] sin [Dolor principal]".',
      'Usa texto en pantalla grande en los primeros 3 segundos: el 75% de las personas ve historias sin volumen activado.',
      'Termina siempre con una sola orden clara: "Toca el enlace de abajo", "Comenta OFERTA y te enviamos el catálogo".'
    ],
    proTip: 'Nunca des más de una instrucción al final. Si pides que te sigan, compartan, comenten y vayan a la web, no harán ninguna.'
  },
  {
    id: 'lesson_color_psychology',
    category: 'Diseño Móvil',
    title: 'Psicología de colores en publicidad de alto impacto',
    readTimeMinutes: 3,
    summary: 'El color transmite el 85% de la primera impresión subconsciente de tu marca en un anuncio publicitario.',
    bulletPoints: [
      'Rojo y Naranja: Estimulan el apetito, la urgencia y las ofertas flash (Ideal para comida, rebajas y liquidaciones).',
      'Azul Marino y Celeste: Comunican confianza, estabilidad y profesionalismo (Ideal para servicios legales, salud, bienes raíces y tecnología).',
      'Verde Esmeralda: Salud, frescura, bienestar, dinero y sostenibilidad (Ideal para nutrición, finanzas y productos orgánicos).',
      'Negro y Dorado: Sofisticación, exclusividad y lujo (Ideal para barberías premium, alta joyería y boutiques).',
      'Amarillo: Optimismo y llamada de atención; úsalo como color de acento para botones de compra o badges de descuento.'
    ],
    proTip: 'Mantén un máximo de 3 colores en tu pieza publicitaria: 60% fondo neutro, 30% color de marca y 10% color de contraste para el botón o precio.'
  },
  {
    id: 'lesson_algorithm_schedule',
    category: 'Estrategia de Redes',
    title: 'Horarios estratégicos y algoritmo de Instagram, TikTok y WhatsApp',
    readTimeMinutes: 4,
    summary: 'Publicar a la hora correcta multiplica el alcance orgánico inicial y activa el impulso del algoritmo en los primeros 30 minutos.',
    bulletPoints: [
      'Horario Almuerzo (12:30 PM - 2:00 PM): La gente revisa el celular mientras come o descansa del trabajo.',
      'Horario Nocturno de Relax (7:30 PM - 9:30 PM): Mayor tiempo de permanencia viendo videos largos y Reels.',
      'WhatsApp Estados: Publica a las 8:00 AM y a las 6:30 PM para mantenerte siempre arriba en la lista de actualizaciones de tus contactos.',
      'Para negocios B2B (empresas y profesionales): Martes a Jueves de 9:00 AM a 11:30 AM.',
      'Responde a todos los comentarios en los primeros 15 minutos: esto le dice a la plataforma que la publicación es viral.'
    ],
    proTip: 'Los videos en formato 9:16 vertical tienen hasta 3.5 veces más reproducciones completas que las imágenes cuadradas o apaisadas.'
  }
];
