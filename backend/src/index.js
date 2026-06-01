/**
 * Cloudflare Worker Backend for Criptana 360
 * Handles newsletter subscriptions and writes directly to Cloudflare D1 SQL database.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Standard CORS headers for cross-domain calls
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Only allow POST requests to /api/subscribe
    const isSubscribe = url.pathname.endsWith('/subscribe') || url.pathname.endsWith('/subscribe/');
    if (isSubscribe && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, lang } = body;

        // Basic validations
        if (!email) {
          return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(JSON.stringify({ error: 'Invalid email format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Get Client IP address for auditing/spam prevention
        const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';

        // Write directly to the D1 Database binding
        // The D1 binding is named "DB" in wrangler.toml
        const result = await env.DB.prepare(
          `INSERT OR IGNORE INTO subscribers (email, lang, ip_address) VALUES (?, ?, ?)`
        ).bind(email, lang || 'es', clientIp).run();

        return new Response(JSON.stringify({ success: true, message: 'Subscriber saved successfully!' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: 'Database transaction failed', details: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Only allow POST requests to /api/send-itinerary
    const isSendItinerary = url.pathname.endsWith('/send-itinerary') || url.pathname.endsWith('/send-itinerary/');
    if (isSendItinerary && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, companions, itineraryText, lang } = body;

        // Basic validations
        if (!email) {
          return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(JSON.stringify({ error: 'Invalid email format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Retrieve Formspree URL from environment variables context
        const formspreeUrl = env.FORMSPREE_URL;
        if (!formspreeUrl) {
          throw new Error('FORMSPREE_URL environment variable is not defined');
        }

        // Forward to Formspree for actual email dispatch
        const mailResponse = await fetch(formspreeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            companions: companions || 'None',
            message: `Itinerary shared by ${email}.\nCompanions: ${companions || 'None'}.\n\nItinerary Details:\n${itineraryText}`
          })
        });

        if (!mailResponse.ok) {
          const mailError = await mailResponse.text();
          throw new Error(`Mailer API returned error status ${mailResponse.status}: ${mailError}`);
        }

        return new Response(JSON.stringify({ success: true, message: 'Itinerary email sent successfully!' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: 'Mail delivery failed', details: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // POST request to /api/generate-itinerary
    const isGenerateItinerary = url.pathname.endsWith('/generate-itinerary') || url.pathname.endsWith('/generate-itinerary/');
    if (isGenerateItinerary && request.method === 'POST') {
      try {
        const body = await request.json();
        const { travel_party, pace, budget_tier, include_swimming_spot, weather_forecast, steering_modifier, lang } = body;

        // Map backend parameters for legacy compatibility when falling back
        const legacyParty = travel_party || body.party || 'familia';
        const legacyPace = pace || body.pace || 'relajado';
        const legacyBudget = budget_tier === 'low' ? 'mochilero' : budget_tier === 'high' ? 'VIP' : (body.budget || 'estandar');

        // Try using Gemini if API key is defined
        if (env.GEMINI_API_KEY) {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
          
          const systemPrompt = `You are a high-end local tourism planning assistant for Campo de Criptana, Spain.
Generate a structured, interactive travel itinerary in JSON format based on the traveler's preferences:
- Travel Party: ${legacyParty} (solo, couple, family, friends)
- Pace: ${legacyPace} (relaxed, intensive)
- Budget Tier: ${budget_tier || 'mid'} (low, mid, high)
- Include Swimming Spot Preference: ${include_swimming_spot ? 'Yes' : 'No'}
- Weather Forecast: Temperature ${weather_forecast ? weather_forecast.current_temp_c : 24}°C, Condition: ${weather_forecast ? weather_forecast.condition : 'clear'}
- Steering Modifier: ${steering_modifier || 'None'}
- Language: ${lang || 'es'} (es, en)

Available Spots (Use only these exact Spot IDs in the "spots" and "choices" arrays):
- Ridge / Windmills Hill: "spot1" (Sierra de los Molinos), "spot_sara_montiel" (Molino Culebro), "spot_ci_molinos" (Molino Infanto), "spot_sala_carros" (Sala de los Carros), "spot3" (Restaurante Las Musas), "spot12" (La Casa del Bachiller), "spot13" (Hostal Ego's), "spot16" (Parking Sierra)
- Town Center & Albaicín: "spot_albaicin" (Barrio del Albaicín), "spot2" (Cueva Pastora Marcela), "spot_posito" (Pósito Real), "spot_iglesia_parroquial" (Parroquia de la Asunción), "spot_patrimonio_religioso" (Convento Carmelitas), "spot_fuente_cano" (Fuente del Caño), "spot_fachadas" (Fachadas del Centro), "spot_escudos" (Escudos Nobiliarios), "spot_eloy_teno" (Museo Eloy Teno), "spot_plaza_mayor_park" (Terrazas Plaza Mayor), "spot_parque_luis_cobos" (Parque Luis Cobos), "spot4" (Restaurante Cueva La Martina), "spot7" (Restaurante La Pulpería), "spot8" (Pizzería Piccolo), "spot9" (Mesón Ricote), "spot11" (Hotel Boutique Casa Treviño)
- Wineries: "spot5" (Bodegas Castiblanque), "spot6" (Vinícola del Carmen), "spot10" (Bodegas Vidal del Saz)
- Out of Town / Nature: "spot_laguna_salicor" (Laguna de Salicor), "spot_centro_naturaleza" (Aula de la Naturaleza), "spot_piscina_municipal" (Piscina Municipal), "spot_ermita_criptana" (Ermita Virgen de Criptana), "spot_ermita_villajos" (Santuario del Cristo), "route_ermitas" (Ruta de las Ermitas), "route_alcazar_drunkards" (Camino de Alcázar), "spot14" (Casa Rural Los Tres Cielos), "spot15" (Área de Autocaravanas Municipal)

Absolute Routing and Scheduling Rules:
1. GEOGRAPHIC CLUSTERING: Group spots on the Ridge ("spot1", "spot_sara_montiel", "spot_ci_molinos", "spot_sala_carros", "spot3") separate from the Town Center ("spot_albaicin", "spot2", "spot_posito", "spot_plaza_mayor_park", etc.) to avoid users walking back and forth between the hill and the center.
2. CRITERIA A (Weather Temperature Override):
   - IF Weather Temperature >= 30°C: The AI is STRICTLY FORBIDDEN from recommending outdoor lunch up at the exposed Windmills (Los Molinos) zone (e.g. Restaurante Las Musas outdoor terrace "spot3"). It must force lunch recommendations into the shaded streets of the Town Center (Centro) or venues equipped with indoor A/C (like "spot4" Cueva La Martina, "spot7" La Pulpería, or "spot9" Mesón Ricote).
   - IF < 30°C: Windmills and open terraces are fully cleared for lunch recommendations.
3. CRITERIA B (Dynamic Budget Menus):
   - "low" Budget: Must include a high-value local picnic hack: instruct the user to buy a bottle of local wine and cured ham at Mercadona, then head up to the Windmills to pop the bottle and enjoy the views outdoors.
   - "mid" Budget: Offer a menu of central tapas bars where a standard drink (€2.50 - €3.00) includes a free traditional local tapa (like "spot9" Mesón Ricote, or "spot_plaza_mayor_park").
   - "high" Budget: Offer premium, sit-down dining options up at the Windmills (subject to the temperature restriction in Criteria A).
4. CRITERIA C (Swimming Spot Integration):
   - IF Include Swimming Spot Preference is true AND Weather Temperature >= 28°C: Automatically allocate a dedicated afternoon block (between 16:00 and 19:00) to cool off at the local municipal pool/swimming spot ("spot_piscina_municipal").
5. STEERING MODIFIERS (Enforce strictly if specified):
   - "morning_arrival": Adjust chronological slots to start at 09:00 with a high-impact morning track.
   - "afternoon_arrival": Adjust chronological slots to start at 15:00 with an afternoon sunset track.
   - "more_tapas": Replace restaurant meals with a premium traditional tapas crawl through the historic center.
   - "cultural_swap": Replace outdoor/nature/leisure spots with indoor historic museums and religious heritage (Eloy Teno, Pósito Real, Carmelitas Convento).
6. PACE: "relaxed" should have 3-4 slots/sights total. "intensive" should have 5-7 slots/sights total.
7. COMPANIONS: "family" must include kid-friendly spots ("spot_parque_luis_cobos", "spot8"). "couple" must include romantic sunset vistas ("spot_albaicin", "spot3").
8. RESPONSE LANGUAGE: If lang is "es", return all text fields (title, summary, slots titles and descriptions, choices) in Spanish. If lang is "en", return them in English.
9. STEERED CONVERSATION MENU (Choices): For each slot, provide a "choices" array representing a menu of 1-2 alternative local choices the traveler can pick from in that itinerary block.

Return exactly this JSON structure (do not wrap in markdown or include backticks):
{
  "title": "Itinerary Title",
  "summary": "Short description explaining why this fits their preferences, weather state, and steering modifiers",
  "estimatedCostRange": "e.g., 10€ - 15€ per person",
  "slots": [
    {
      "time": "e.g. 10:00 - 13:00",
      "title": "Slot Title",
      "description": "Short explanation of the activity",
      "spots": ["spot_id1", "spot_id2"],
      "choices": [
        {
          "name": "Option A / Option name",
          "spots": ["alternative_spot_id"],
          "description": "Short explanation of this choice"
        }
      ]
    }
  ]
}`;

          const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: systemPrompt
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json'
              }
            })
          });

          if (geminiResponse.ok) {
            const resData = await geminiResponse.json();
            const textResponse = resData.candidates[0].content.parts[0].text;
            
            // Validate it is correct JSON and parse it
            const parsed = JSON.parse(textResponse.trim());
            return new Response(JSON.stringify(parsed), {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          } else {
            console.warn(`Gemini API returned error status ${geminiResponse.status}. Using high-quality fallback...`);
          }
        } else {
          console.warn("GEMINI_API_KEY is not defined. Using high-quality fallback...");
        }

        // Fallback
        const fallback = generateFallbackItinerary(legacyParty, legacyPace, legacyBudget, lang || 'es', include_swimming_spot, weather_forecast ? weather_forecast.current_temp_c : 24, steering_modifier);
        return new Response(JSON.stringify(fallback), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err) {
        console.error("Worker generate-itinerary crashed:", err);
        try {
          const body = await request.json().catch(() => ({}));
          const partyVal = body.travel_party || body.party || 'familia';
          const paceVal = body.pace || 'relajado';
          const budgetVal = body.budget_tier === 'low' ? 'mochilero' : body.budget_tier === 'high' ? 'VIP' : (body.budget || 'estandar');
          const fallback = generateFallbackItinerary(partyVal, paceVal, budgetVal, body.lang || 'es', body.include_swimming_spot, body.weather_forecast ? body.weather_forecast.current_temp_c : 24, body.steering_modifier);
          return new Response(JSON.stringify(fallback), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Generation crashed completely', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }
    }

    // Default response for other endpoints
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

function generateFallbackItinerary(party, pace, budget, lang, includeSwimming = false, temp = 24, steeringModifier = null) {
  const isEs = lang === 'es';
  
  // 1. Title, Cost, and Summary Resolution based on selections
  let title = isEs ? "Ruta Criptana Clásica 360" : "Classic Criptana 360 Route";
  let summary = isEs 
    ? "Un itinerario optimizado localmente para tu grupo con la esencia de Campo de Criptana." 
    : "An itinerary locally optimized for your party with the essence of Campo de Criptana.";
  let costRange = "25€ - 45€";
  
  if (budget === 'mochilero') {
    title = isEs ? "Itinerario de Bajo Costo y Aventura" : "Low Budget Adventure Itinerary";
    summary = isEs 
      ? "Una experiencia de costo cero combinando senderismo en los gigantes de la Sierra y el casco antiguo."
      : "A zero-cost adventure combining hiking around the Sierra giants and exploring historic districts.";
    costRange = "0€ - 15€";
  } else if (budget === 'VIP') {
    title = isEs ? "Mancha Dorada VIP & Bodegas de Prestigio" : "Golden Mancha VIP & Premium Cellars";
    summary = isEs 
      ? "Un día de máximo confort y sofisticación con catas premium y las mejores terrazas locales."
      : "A sophisticated day of maximum comfort featuring premium tastings and superior panoramic dining.";
    costRange = "85€ - 150€";
  }

  // Handle weather overrides in summary
  if (temp >= 30) {
    summary += isEs 
      ? " Ajustado dinámicamente con sombra y aire acondicionado por ola de calor superior a 30°C." 
      : " Dynamically optimized with indoor shade and A/C due to high temperature above 30°C.";
  }

  // Handle steering modifiers in summary
  if (steeringModifier === 'morning_arrival') {
    summary += isEs ? " Optimizado para inicio temprano por la mañana (09:00)." : " Optimized for early morning arrival (09:00).";
  } else if (steeringModifier === 'afternoon_arrival') {
    summary += isEs ? " Optimizado para llegada por la tarde y puesta de sol (15:00)." : " Optimized for afternoon arrival and sunset track (15:00).";
  } else if (steeringModifier === 'more_tapas') {
    summary += isEs ? " Centrado en la gastronomía tradicional de tapas." : " Focused on traditional local tapas crawl.";
  } else if (steeringModifier === 'cultural_swap') {
    summary += isEs ? " Adaptado con museos y patrimonio cultural de interior." : " Adapted with indoor museums and religious heritage.";
  }

  const slots = [];

  // Determine starting hour
  let startHour = 10;
  if (steeringModifier === 'morning_arrival') {
    startHour = 9;
  } else if (steeringModifier === 'afternoon_arrival') {
    startHour = 15;
  }

  // Slot 1: Morning exploration or initial arrival
  let slot1Time = `${startHour}:00 - ${startHour + 3}:00`;
  let slot1Title = isEs ? "Mañana: Molinos Históricos y Sierra" : "Morning: Historic Ridge & Windmills";
  let slot1Desc = isEs 
    ? "Explora la Sierra de los Molinos con sus gigantes de viento y el Molino Infanto original."
    : "Explore the historic ridge of Sierra de los Molinos with its legendary windmills.";
  let slot1Spots = ["spot1", "spot_ci_molinos"];
  let slot1Choices = [
    {
      name: isEs ? "Opción A: Molino Infanto" : "Option A: Infanto Windmill",
      spots: ["spot_ci_molinos"],
      description: isEs ? "Conoce de primera mano la maquinaria original del siglo XVI." : "Discover the original 16th-century milling machinery."
    },
    {
      name: isEs ? "Opción B: Museo Eloy Teno" : "Option B: Eloy Teno Museum",
      spots: ["spot_eloy_teno"],
      description: isEs ? "Artesanía local en hierro y metal tallada a mano." : "Local hand-crafted iron and metal sculptures."
    }
  ];

  if (steeringModifier === 'cultural_swap') {
    slot1Title = isEs ? "Inicio: Inmersión Cultural y Pósito Real" : "Start: Cultural Immersion & Pósito Real";
    slot1Desc = isEs 
      ? "Visita las salas del Pósito Real y el Museo de artesanía Eloy Teno en el centro."
      : "Tour the historic granary of Pósito Real and the Eloy Teno crafts museum in the center.";
    slot1Spots = ["spot_posito", "spot_eloy_teno"];
  }

  slots.push({
    time: slot1Time,
    title: slot1Title,
    description: slot1Desc,
    spots: slot1Spots,
    choices: slot1Choices
  });

  // Slot 2: Lunch / Dining
  let slot2Time = `${startHour + 3}:00 - ${startHour + 5}:30`;
  let slot2Title = isEs ? "Almuerzo: Sabores de la Tierra" : "Lunch: Local Manchego Flavors";
  let slot2Desc = isEs 
    ? "Degusta la gastronomía local con pisto manchego y migas tradicionales."
    : "Savor local gastronomy with pisto manchego and authentic dishes.";
  let slot2Spots = ["spot4"];
  let slot2Choices = [];

  // Criteria B & A (Budget and Temperature Overrides)
  if (budget === 'mochilero') {
    // Low Budget picnic hack
    slot2Title = isEs ? "Almuerzo: Picnic en la Sierra (Ahorro Inteligente)" : "Lunch: Scenic Picnic Hack (Low Cost)";
    slot2Desc = isEs 
      ? "Compra queso manchego, jamón y vino en el Mercadona local y disfruta de un picnic único frente a los molinos."
      : "Buy Manchego cheese, cured ham and local wine at Mercadona, and enjoy a premium outdoor picnic with ridge views.";
    slot2Spots = ["spot_parque_luis_cobos", "spot9"];
    slot2Choices = [
      {
        name: isEs ? "Alternativa: Tapas Económicas en Ricote" : "Alternative: Budget Tapas at Ricote",
        spots: ["spot9"],
        description: isEs ? "Ambiente de taberna local muy económico en el centro." : "Highly affordable local tavern atmosphere in the center."
      }
    ];
  } else if (budget === 'VIP') {
    // High Budget sit-down
    slot2Title = isEs ? "Almuerzo: Gastronomía de Autor" : "Lunch: Fine Scenic Dining";
    
    // Temperature Override check (Criteria A)
    if (temp >= 30) {
      slot2Desc = isEs 
        ? "Mesa reservada en el interior climatizado de Cueva La Martina. Comida fresca en cueva natural fresca."
        : "Table reserved in the fully air-conditioned natural cave of Cueva La Martina. Keep cool naturally!";
      slot2Spots = ["spot4"];
      slot2Choices = [
        {
          name: isEs ? "Alternativa: La Pulpería (A/C)" : "Alternative: La Pulpería (A/C)",
          spots: ["spot7"],
          description: isEs ? "Comedor interior confortable climatizado." : "Comfortable fully air-conditioned dining room."
        }
      ];
    } else {
      // Windmills terrasse open
      slot2Desc = isEs 
        ? "Mesa reservada en la espectacular terraza escénica de Las Musas en lo alto de la Sierra."
        : "Table reserved at the spectacular scenic terrace of Las Musas overlooking the windmills.";
      slot2Spots = ["spot3"];
      slot2Choices = [
        {
          name: isEs ? "Alternativa: Cueva La Martina" : "Alternative: Cave La Martina",
          spots: ["spot4"],
          description: isEs ? "Comida en cueva natural histórica en el Albaicín." : "Dine inside an authentic cave dwelling in Albaicín."
        }
      ];
    }
  } else {
    // Estandar budget
    if (temp >= 30) {
      slot2Desc = isEs 
        ? "Comida confortable en el comedor interior climatizado de La Pulpería o Cueva La Martina."
        : "Comfortable dining in the air-conditioned indoor rooms of La Pulpería or Cueva La Martina.";
      slot2Spots = ["spot7", "spot4"];
    } else {
      slot2Spots = ["spot4", "spot_plaza_mayor_park"];
    }
    
    // Tapas crawl modifier (steeringModifier)
    if (steeringModifier === 'more_tapas') {
      slot2Title = isEs ? "Almuerzo: Ruta Tradicional de Cañas y Tapas" : "Lunch: Traditional Tapas Crawl Track";
      slot2Desc = isEs 
        ? "Ruta por bares del centro (Mesón Ricote) donde cada consumición incluye una tapa tradicional gratuita."
        : "Walk through town center taverns (Mesón Ricote) where standard drinks include free local tapas.";
      slot2Spots = ["spot9", "spot_plaza_mayor_park"];
    }
  }

  slots.push({
    time: slot2Time,
    title: slot2Title,
    description: slot2Desc,
    spots: slot2Spots,
    choices: slot2Choices
  });

  // Slot 3: Afternoon block (Nature, Wineries or Swimming pool!)
  let slot3Time = `${startHour + 5}:30 - ${startHour + 8}:30`;
  let slot3Title = isEs ? "Tarde: Bodegas Castiblanque y Catas" : "Afternoon: Guided Wine Tasting Experience";
  let slot3Desc = isEs 
    ? "Visita guiada por la histórica bodega de barricas del siglo XIX en Bodegas Castiblanque."
    : "Guided tour through the historic 19th-century cellars and oak barrels at Bodegas Castiblanque.";
  let slot3Spots = ["spot5"];
  let slot3Choices = [
    {
      name: isEs ? "Opción A: Bodegas Vidal del Saz" : "Option A: Vidal del Saz Winery",
      spots: ["spot10"],
      description: isEs ? "Visita familiar con degustación de crianzas y reservas." : "Family-run estate with premium red reserve tastings."
    },
    {
      name: isEs ? "Opción B: Convento del Carmen" : "Option B: Convento del Carmen",
      spots: ["spot_patrimonio_religioso"],
      description: isEs ? "Patrimonio religioso con arquitectura barroca del siglo XVI." : "Religious heritage with 16th-century baroque architecture."
    }
  ];

  // Swimming Spot Integration (Criteria C)
  if (includeSwimming === true && temp >= 28) {
    slot3Title = isEs ? "Tarde: Refrescante en la Piscina Municipal" : "Afternoon: Cool Off at the Municipal Pool";
    slot3Desc = isEs 
      ? "Evita las horas calurosas de la tarde bañándote y relajándote en las amplias piscinas municipales exteriores."
      : "Escape the heat of the afternoon by swimming and relaxing at the spacious outdoor municipal pools.";
    slot3Spots = ["spot_piscina_municipal"];
    slot3Choices.unshift({
      name: isEs ? "Alternativa: Bodegas Castiblanque" : "Alternative: Castiblanque Winery",
      spots: ["spot5"],
      description: isEs ? "Refúgiate del sol en las frescas barricas centenarias de la bodega." : "Take shelter from the sun in the cool historic barrel rooms."
    });
  } else if (steeringModifier === 'cultural_swap') {
    slot3Title = isEs ? "Tarde: Convento Carmelitas y Patrimonio Religioso" : "Afternoon: Carmelitas Convent & Religious Heritage";
    slot3Desc = isEs 
      ? "Admira el claustro barroco e interior histórico del Convento de las Carmelitas Descalzas del siglo XVI."
      : "Admire the beautiful baroque cloister and historical artwork at the 16th-century Carmelitas Convent.";
    slot3Spots = ["spot_patrimonio_religioso", "spot_fuente_cano"];
  }

  slots.push({
    time: slot3Time,
    title: slot3Title,
    description: slot3Desc,
    spots: slot3Spots,
    choices: slot3Choices
  });

  // Slot 4: Sunset and Twilight Albaicín Walk
  let slot4Time = `${startHour + 8}:30 - 21:00`;
  if (steeringModifier === 'afternoon_arrival') {
    slot4Time = `20:30 - 22:30`;
  }
  let slot4Title = isEs ? "Atardecer: Cueva Pastora Marcela y Albaicín" : "Sunset: Albaicín Walk & Pastora Marcela Cave";
  let slot4Desc = isEs 
    ? "El momento más espectacular. Pasea entre las fachadas de color blanco y añil manchego del barrio del Albaicín."
    : "The most spectacular moment. Stroll past the beautiful whitewashed and indigo facades of the Albaicín district.";
  let slot4Spots = ["spot_albaicin", "spot2"];
  let slot4Choices = [
    {
      name: isEs ? "Opción A: Cueva Pastora Marcela" : "Option A: Pastora Marcela Cave",
      spots: ["spot2"],
      description: isEs ? "Una auténtica cueva-vivienda subterránea histórica amueblada." : "An authentic, fully furnished historical cave dwelling."
    },
    {
      name: isEs ? "Opción B: Hotel boutique Casa Treviño" : "Option B: Boutique Hotel Casa Treviño",
      spots: ["spot11"],
      description: isEs ? "Relájate con un vino en la cueva spa subterránea medieval." : "Unwind with a glass of local wine inside a medieval cave spa."
    }
  ];

  slots.push({
    time: slot4Time,
    title: slot4Title,
    description: slot4Desc,
    spots: slot4Spots,
    choices: slot4Choices
  });

  return {
    title: title,
    summary: summary,
    estimatedCostRange: costRange,
    slots: slots
  };
}
