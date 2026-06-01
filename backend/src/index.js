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
        
        // Support both new requested keys and old keys defensively
        const userEmail = body.userEmail || body.email;
        const companions = body.companions || [];
        const itineraryData = body.itineraryData || body.itineraryText;
        const lang = body.lang || 'es';

        // Basic validations
        if (!userEmail) {
          return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
          return new Response(JSON.stringify({ error: 'Invalid email format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        if (!itineraryData) {
          return new Response(JSON.stringify({ error: 'Itinerary data is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Validate BREVO_API_KEY environment binding
        if (!env.BREVO_API_KEY) {
          throw new Error('BREVO_API_KEY secret environment variable is not defined');
        }

        // Format companions into Brevo-compatible CC array of objects
        let companionEmails = [];
        if (Array.isArray(companions)) {
          companionEmails = companions
            .map(function(c) { return { email: String(c).trim() }; })
            .filter(function(c) { return c.email.length > 0 && emailRegex.test(c.email); });
        } else if (typeof companions === 'string' && companions.trim().length > 0 && companions !== 'None') {
          companionEmails = companions
            .split(',')
            .map(function(c) { return { email: c.trim() }; })
            .filter(function(c) { return c.email.length > 0 && emailRegex.test(c.email); });
        }

        // Parse plaintext itineraryData into premium responsive HTML email format
        let formattedHtml = itineraryData
          .split('\n')
          .map(function(line) {
            const trimmed = line.trim();
            if (trimmed.startsWith('🚀') || trimmed.startsWith('⏰') || trimmed.startsWith('🚗') || trimmed.startsWith('🗺️')) {
              return `<h3 style="color: #0B4FC8; font-family: 'Georgia', serif; font-size: 1.15rem; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold;">${trimmed}</h3>`;
            } else if (trimmed.startsWith('•')) {
              return `<li style="margin-bottom: 0.35rem; list-style-type: none; padding-left: 1rem; border-left: 3px solid #0B4FC8; font-size: 0.88rem; color: #334155; font-family: sans-serif;">${trimmed.substring(1).trim()}</li>`;
            } else if (trimmed.length === 0) {
              return '<br>';
            } else {
              return `<p style="margin: 0.5rem 0; font-family: sans-serif; font-size: 0.88rem; line-height: 1.5; color: #4b5563;">${trimmed}</p>`;
            }
          })
          .join('\n');

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mi Itinerario Criptana 360</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 2rem 1rem;">
              <tr>
                <td align="center">
                  <table width="100%" max-width="600px" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(15,23,42,0.03); overflow: hidden; padding: 2rem;">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem;">
                        <h1 style="color: #0B4FC8; font-family: Georgia, serif; font-size: 1.85rem; margin: 0; font-weight: bold; letter-spacing: 0.05em;">Criptana<span style="color: #F59E0B;">360</span></h1>
                        <p style="color: #64748b; font-size: 0.75rem; margin: 0.25rem 0 0 0; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">${lang === 'es' ? 'La Guía Local e Itinerario Inteligente' : 'The Local Guide & Smart Itinerary'}</p>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td align="left" style="padding-top: 1rem;">
                        ${formattedHtml}
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="border-top: 1px solid #e2e8f0; padding-top: 1.5rem; margin-top: 2rem; color: #94a3b8; font-size: 0.72rem;">
                        <p style="margin: 0 0 0.4rem 0;">${lang === 'es' ? 'Creado por Criptana 360. ¡Disfruta de tu escapada a Campo de Criptana!' : 'Created by Criptana 360. Enjoy your getaway to Campo de Criptana!'}</p>
                        <p style="margin: 0;">&copy; 2026 Criptana 360 · LUZE Media Marketing</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        const brevoPayload = {
          sender: {
            name: 'Criptana 360',
            email: 'criptana360@gmail.com'
          },
          to: [
            {
              email: userEmail
            }
          ],
          subject: lang === 'es' ? 'Mi Ruta Planificada en Criptana 🗺️' : 'My Planned Criptana Itinerary 🗺️',
          htmlContent: htmlContent
        };

        if (companionEmails.length > 0) {
          brevoPayload.cc = companionEmails;
        }

        // Dispatch email via Brevo transactional SMTP endpoint
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': env.BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify(brevoPayload)
        });

        if (!brevoResponse.ok) {
          const brevoError = await brevoResponse.text();
          throw new Error(`Brevo SMTP service error ${brevoResponse.status}: ${brevoError}`);
        }

        return new Response(JSON.stringify({ success: true, message: 'Itinerary email dispatched successfully via Brevo!' }), {
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
        const {
          travel_party,
          pace,
          budget_tier,
          next_destination,
          weather_forecast,
          steering_modifier,
          lang
        } = body;
 
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
- Next Destination Extension: ${next_destination || 'none'}
- Weather Forecast: Temperature ${weather_forecast ? weather_forecast.current_temp_c : 24}°C, Condition: ${weather_forecast ? weather_forecast.condition : 'clear'}
- Steering Modifier: ${steering_modifier || 'None'}
- Language: ${lang || 'es'} (es, en)
 
Available Spots (Use only these exact Spot IDs in the "spots" and "choices" arrays):
- Ridge / Windmills Hill: "spot1", "spot_sara_montiel", "spot_ci_molinos", "spot_sala_carros", "spot3", "spot12", "spot13", "spot16"
- Town Center & Albaicín: "spot_albaicin", "spot2", "spot_posito", "spot_iglesia_parroquial", "spot_patrimonio_religioso", "spot_fuente_cano", "spot_fachadas", "spot_escudos", "spot_eloy_teno", "spot_plaza_mayor_park", "spot_parque_luis_cobos", "spot4", "spot7", "spot8", "spot9", "spot11"
- Wineries: "spot5", "spot6", "spot10"
- Out of Town / Nature: "spot_laguna_salicor", "spot_centro_naturaleza", "spot_piscina_municipal", "spot_ermita_criptana", "spot_ermita_villajos", "route_ermitas", "route_alcazar_drunkards", "spot14", "spot15"
 
Absolute Routing and Scheduling Rules:
1. GEOGRAPHIC CLUSTERING: Group spots on the Ridge separate from the Town Center.
2. CRITERIA A (Weather Temperature Override):
   - IF Weather Temperature >= 30°C: The AI is STRICTLY FORBIDDEN from recommending outdoor lunch up at the exposed Windmills. It must force lunch into the Town Center (shaded/AC venues like "spot4", "spot7", "spot9").
   - IF < 30°C: Windmills and open terraces are fully cleared for lunch recommendations.
3. CRITERIA B (Dynamic Budget Menus):
   - "low" Budget: Must include a high-value local picnic hack: instruct the user to buy a bottle of local wine and cured ham at Mercadona, then head up to the Windmills to pop the bottle and enjoy the views outdoors.
   - "mid" Budget: Offer a menu of central tapas bars where a standard drink includes a free traditional local tapa (like "spot9", "spot_plaza_mayor_park").
   - "high" Budget: Offer premium, sit-down dining options up at the Windmills (subject to temperature restriction).
4. CRITERIA C (Weather pool Easter Egg):
   - IF Weather Temperature >= 30°C: Automatically allocate a dedicated afternoon block (between 16:00 and 19:00) to cool off at the local municipal pool/swimming spot ("spot_piscina_municipal"). The afternoon timeline block's description text MUST dynamically inject the exact afternoon pool "Easter Egg" text, exactly matching: "It's hot out there! Head over to the local municipal pool zone to beat the midday sun. There is a great bar right next to it serving incredible cold drinks and tapas in the shade."
5. STEERING MODIFIERS:
   - "morning_arrival": Start at 09:00.
   - "afternoon_arrival": Start at 15:00.
   - "more_tapas": Replace restaurant meals with a premium traditional tapas crawl.
   - "cultural_swap": Replace outdoor/nature/leisure spots with indoor historic museums.
6. PACE: "relaxed" 3-4 slots, "intensive" 5-7 slots.
7. COMPANIONS: "family" must include kid-friendly spots, "couple" must include romantic sunset vistas.
8. NEXT DESTINATION CONNECTION TACTICAL ADVICE:
   - IF Next Destination Extension is not "none": Append a clear travel connection segment tip at the end of the "summary" string.
9. RESPONSE LANGUAGE: If lang is "es", return all text fields in Spanish. If lang is "en", return them in English.
10. STEERED CONVERSATION MENU: Provide a "choices" array for each slot.
 
Return exactly this JSON structure (do not wrap in markdown or include backticks):
{
  "title": "Itinerary Title",
  "summary": "Short description explaining why this fits their preferences, weather state, activity options, and connection segment advice if next destination is not none",
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
        const fallback = generateFallbackItinerary(
          legacyParty,
          legacyPace,
          legacyBudget,
          lang || 'es',
          weather_forecast ? weather_forecast.current_temp_c : 24,
          steering_modifier || null,
          next_destination || 'none'
        );
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
          
          const nextDestinationVal = body.next_destination || 'none';
          
          const fallback = generateFallbackItinerary(
            partyVal,
            paceVal,
            budgetVal,
            body.lang || 'es',
            body.weather_forecast ? body.weather_forecast.current_temp_c : 24,
            body.steering_modifier || null,
            nextDestinationVal
          );
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

function generateFallbackItinerary(party, pace, budget, lang, temp = 24, steeringModifier = null, nextDestination = 'none') {
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

  // Append next destination tactical advice tip
  if (nextDestination && nextDestination !== 'none') {
    let connText = '';
    if (isEs) {
      if (nextDestination === 'toboso') connText = " 💡 Extensión de Ruta: Toma la TO-3120 al norte hacia El Toboso, la cuna literaria de Dulcinea (a 15 min).";
      else if (nextDestination === 'consuegra') connText = " 💡 Extensión de Ruta: Conecta por la autovía CM-42 oeste hacia Consuegra para ver sus famosos gigantes de viento en el cerro Calderico (a 30 min).";
      else if (nextDestination === 'tomelloso') connText = " 💡 Extensión de Ruta: Sigue por la CM-3105 al sur hacia Tomelloso para explorar sus cuevas bodega tradicionales y bodegas (a 25 min).";
      else if (nextDestination === 'alcazar') connText = " 💡 Extensión de Ruta: Dirígete en 8 min por la CM-420 a Alcázar de San Juan para ver su conjunto palacial medieval y lagunas.";
      else if (nextDestination === 'socuellamos') connText = " 💡 Extensión de Ruta: Toma la CM-3102 al este hacia Socuéllamos, la cuna vinícola con su vanguardista Museo Torre del Vino.";
      else if (nextDestination === 'herencia') connText = " 💡 Extensión de Ruta: Conecta por la CM-420 al oeste con Herencia para conocer los molinos tradicionales de La Pedriza.";
    } else {
      if (nextDestination === 'toboso') connText = " 💡 Route Extension: Take TO-3120 north to El Toboso, the home of Don Quixote's Dulcinea (15 min drive).";
      else if (nextDestination === 'consuegra') connText = " 💡 Route Extension: Follow CM-42 highway west to Consuegra to visit the famous medieval castle and Calderico ridge (30 min drive).";
      else if (nextDestination === 'tomelloso') connText = " 💡 Route Extension: Head south on CM-3105 to Tomelloso, a wine capital famous for its traditional hand-carved cellar caves (25 min drive).";
      else if (nextDestination === 'alcazar') connText = " 💡 Route Extension: Take CM-420 west for 8 min to Alcázar de San Juan to explore its Grand Prior Palace and unique wetland lagoons.";
      else if (nextDestination === 'socuellamos') connText = " 💡 Route Extension: Drive east on CM-3102 to Socuéllamos to explore the high-tech Wine Tower Museum.";
      else if (nextDestination === 'herencia') connText = " 💡 Route Extension: Take CM-420 west to Herencia to see the historic windmills on La Pedriza hill.";
    }
    summary += connText;
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

  // Temperature Override check for Pool Easter Egg
  if (temp >= 30) {
    slot3Title = isEs ? "Tarde: Refrescante en la Piscina Municipal" : "Afternoon: Cool Off at the Municipal Pool";
    slot3Desc = "It's hot out there! Head over to the local municipal pool zone to beat the midday sun. There is a great bar right next to it serving incredible cold drinks and tapas in the shade.";
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
