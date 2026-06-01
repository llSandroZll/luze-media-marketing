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
        const { party, pace, budget, lang } = body;

        // Try using Gemini if API key is defined
        if (env.GEMINI_API_KEY) {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
          
          const systemPrompt = `You are a high-end local tourism planning assistant for Campo de Criptana, Spain.
Generate a structured chronological travel itinerary in JSON format based on the traveler's preferences:
- Party: ${party || 'familia'} (solo, pareja, familia, amigos)
- Pace: ${pace || 'relajado'} (relajado, intensivo)
- Budget: ${budget || 'estandar'} (mochilero, estandar, VIP)
- Language: ${lang || 'es'} (es, en)

Available Spots (Use only these exact Spot IDs in the "spots" arrays):
- Ridge / Windmills Hill: "spot1" (Sierra de los Molinos), "spot_sara_montiel" (Molino Culebro), "spot_ci_molinos" (Molino Infanto), "spot_sala_carros" (Sala de los Carros), "spot3" (Restaurante Las Musas), "spot12" (La Casa del Bachiller), "spot13" (Hostal Ego's), "spot16" (Parking Sierra)
- Town Center & Albaicín: "spot_albaicin" (Barrio del Albaicín), "spot2" (Cueva Pastora Marcela), "spot_posito" (Pósito Real), "spot_iglesia_parroquial" (Parroquia de la Asunción), "spot_patrimonio_religioso" (Convento Carmelitas), "spot_fuente_cano" (Fuente del Caño), "spot_fachadas" (Fachadas del Centro), "spot_escudos" (Escudos Nobiliarios), "spot_eloy_teno" (Museo Eloy Teno), "spot_plaza_mayor_park" (Terrazas Plaza Mayor), "spot_parque_luis_cobos" (Parque Luis Cobos), "spot4" (Restaurante Cueva La Martina), "spot7" (Restaurante La Pulpería), "spot8" (Pizzería Piccolo), "spot9" (Mesón Ricote), "spot11" (Hotel Boutique Casa Treviño)
- Wineries: "spot5" (Bodegas Castiblanque), "spot6" (Vinícola del Carmen), "spot10" (Bodegas Vidal del Saz)
- Out of Town / Nature: "spot_laguna_salicor" (Laguna de Salicor), "spot_centro_naturaleza" (Aula de la Naturaleza), "spot_piscina_municipal" (Piscina Municipal), "spot_ermita_criptana" (Ermita Virgen de Criptana), "spot_ermita_villajos" (Santuario del Cristo), "route_ermitas" (Ruta de las Ermitas), "route_alcazar_drunkards" (Camino de Alcázar), "spot14" (Casa Rural Los Tres Cielos), "spot15" (Área de Autocaravanas Municipal)

Absolute Rules:
1. GEOGRAPHIC CLUSTERING: Group spots on the Ridge ("spot1", "spot_sara_montiel", "spot_ci_molinos", "spot_sala_carros", "spot3") separate from the Town Center ("spot_albaicin", "spot2", "spot_posito", "spot_plaza_mayor_park", etc.) to avoid users walking back and forth between the hill and the center.
2. BUDGET PROFILES:
   - "mochilero" must map strictly to free attractions and cheap dining like "spot9" or picnic spaces like "spot_parque_luis_cobos" (<15€/person).
   - "estandar" maps to standard museum interiors and traditional menus (25€-50€/person) like "spot7", "spot8", or "spot4".
   - "VIP" maps to private tours, wine tastings like "spot5", premium dining at "spot3", or hotel boutique stays like "spot11" (>75€/person).
3. PACE: "relajado" should have 3-4 slots/sights total. "intensivo" should have 5-7 slots/sights total.
4. COMPANIONS: "familia" must include kid-friendly spots ("spot_parque_luis_cobos", "spot8", "spot_piscina_municipal"). "pareja" must include romantic sunset vistas ("spot_albaicin", "spot3").
5. RESPONSE LANGUAGE: If lang is "es", return all text fields (title, summary, slots titles and descriptions) in Spanish. If lang is "en", return them in English.

Return exactly this JSON structure (do not wrap in markdown or include backticks):
{
  "title": "Itinerary Title",
  "summary": "Short 1-2 sentence description explaining why this itinerary fits their party, pace, and budget",
  "estimatedCostRange": "e.g., 10€ - 15€ per person",
  "slots": [
    {
      "time": "e.g. 10:00 - 13:00",
      "title": "Slot Title",
      "description": "Short explanation of the activity",
      "spots": ["spot_id1", "spot_id2"]
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
        const fallback = generateFallbackItinerary(party || 'familia', pace || 'relajado', budget || 'estandar', lang || 'es');
        return new Response(JSON.stringify(fallback), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err) {
        console.error("Worker generate-itinerary crashed:", err);
        try {
          const body = await request.json().catch(() => ({}));
          const fallback = generateFallbackItinerary(body.party || 'familia', body.pace || 'relajado', body.budget || 'estandar', body.lang || 'es');
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

function generateFallbackItinerary(party, pace, budget, lang) {
  const isEs = lang === 'es';
  
  if (budget === 'mochilero') {
    return {
      title: isEs ? "Ruta del Viajero Libre e Independiente" : "Free & Independent Explorer Route",
      summary: isEs 
        ? "Un itinerario de costo cero centrado en el senderismo rural y las impresionantes vistas exteriores de los molinos y el casco antiguo."
        : "A zero-cost itinerary focused on rural trails, free sights, and the breathtaking exterior views of the windmills.",
      estimatedCostRange: "0€ - 15€",
      slots: [
        {
          time: "10:00 - 13:00",
          title: isEs ? "Mañana: Senderismo por la Sierra y Molinos Libres" : "Morning: Windmill Ridge Walk & Free Sights",
          description: isEs 
            ? "Camina por la colina de la Sierra de los Molinos para contemplar los gigantes exteriores del Quijote sin coste alguno."
            : "Stroll along the Sierra de los Molinos ridge to admire the historic giants of Don Quixote for free.",
          spots: ["spot1", "spot_sara_montiel"]
        },
        {
          time: "13:00 - 15:30",
          title: isEs ? "Almuerzo: Picnic en el Parque o Tapas Económicas" : "Lunch: Park Picnic or Budget Tapas",
          description: isEs 
            ? "Disfruta de unas raciones tradicionales y económicas de queso manchego y pisto en el mesón local del centro."
            : "Savor simple, authentic Manchego cheese and tapas at a local tavern in the town center.",
          spots: ["spot_parque_luis_cobos", "spot9"]
        },
        {
          time: "15:30 - 18:30",
          title: isEs ? "Tarde: Casco Antiguo y Pósito Real" : "Afternoon: Old Town Walks & Pósito Real",
          description: isEs 
            ? "Pasea por el centro histórico peatonal para admirar las fachadas nobles y entra al histórico granero del Pósito."
            : "Wander through the historic pedestrian center to admire noble heraldic shields and visit the historic Pósito granary.",
          spots: ["spot_posito", "spot_fachadas", "spot_escudos"]
        },
        {
          time: "18:30 - 21:00",
          title: isEs ? "Atardecer: Calles Pintorescas del Albaicín" : "Sunset: Pictorial Albaicín District",
          description: isEs 
            ? "El momento cumbre del atardecer paseando por las calles de color blanco y añil manchego."
            : "The highlight of the day! Walk through the beautiful whitewashed and indigo streets of the Albaicín district.",
          spots: ["spot_albaicin", "spot2"]
        }
      ]
    };
  } else if (budget === 'VIP') {
    return {
      title: isEs ? "Experiencia Manchega VIP de Lujo" : "Luxury VIP Manchego Experience",
      summary: isEs 
        ? "Una escapada exclusiva de ritmo selecto con catas privadas de vinos D.O. La Mancha y una cena en la mejor terraza escénica de la Sierra."
        : "An exclusive, high-end escape featuring private wine tastings at premium cellars and fine dining with ridge views.",
      estimatedCostRange: "85€ - 150€",
      slots: [
        {
          time: "10:00 - 13:00",
          title: isEs ? "Mañana: Visita Privada a los Molinos Históricos" : "Morning: Private Windmill Interior Tour",
          description: isEs 
            ? "Accede en privado al interior del Molino Infanto para ver el engranaje original y visita la exposición de Sara Montiel."
            : "Enjoy a private interior tour of Molino Infanto to see the original wood machinery, followed by the Sara Montiel museum.",
          spots: ["spot_ci_molinos", "spot_sara_montiel"]
        },
        {
          time: "13:00 - 15:30",
          title: isEs ? "Almuerzo: Gastronomía de Autor en Las Musas" : "Lunch: Fine Dining with Windmill Views",
          description: isEs 
            ? "Mesa reservada en la terraza panorámica de Las Musas para degustar cocina manchega contemporánea y vinos premium."
            : "Reserved table on the scenic terrace of Las Musas, savoring contemporary Manchego cuisine paired with fine D.O. wines.",
          spots: ["spot3"]
        },
        {
          time: "15:30 - 18:30",
          title: isEs ? "Tarde: Cata Exclusiva de Vinos en Castiblanque" : "Afternoon: Exclusive Guided Wine Tasting",
          description: isEs 
            ? "Visita privada a la bodega del siglo XIX de Bodegas Castiblanque con el enólogo y cata de sus mejores reservas."
            : "Private tour of the historic 19th-century Bodegas Castiblanque with the head winemaker, tasting premium reserves.",
          spots: ["spot5"]
        },
        {
          time: "18:30 - 21:00",
          title: isEs ? "Atardecer y Alojamiento: Noche Romántica en Hotel Boutique" : "Sunset & Stay: Romantic Boutique Hotel Check-in",
          description: isEs 
            ? "Check-in en tu suite del hotel boutique Casa Treviño en pleno centro histórico y disfruta de su spa subterráneo."
            : "Check-in at the premium Casa Treviño Boutique Hotel in the historic center, relaxing in their underground cave spa.",
          spots: ["spot11", "spot12"]
        }
      ]
    };
  } else {
    // Estandar
    return {
      title: isEs ? "Ruta Criptana Clásica 360" : "Classic Criptana 360 Route",
      summary: isEs 
        ? "El itinerario clásico equilibrado ideal para familias y grupos para capturar todos los molinos, museos locales y platos manchegos tradicionales."
        : "The ideal balanced itinerary for groups and families, capturing all historic mills, local craft museums, and authentic dishes.",
      estimatedCostRange: "30€ - 50€",
      slots: [
        {
          time: "10:00 - 13:00",
          title: isEs ? "Mañana: Molino Infanto y Museo Eloy Teno" : "Morning: Infanto Windmill & local Craft Museums",
          description: isEs 
            ? "Aprende el funcionamiento del molino histórico y recorre el asombroso museo de metal de Eloy Teno en el centro."
            : "Learn the secrets of the mill interior at Molino Infanto and visit the metal art sculptures of Eloy Teno.",
          spots: ["spot_ci_molinos", "spot_eloy_teno"]
        },
        {
          time: "13:00 - 15:30",
          title: isEs ? "Almuerzo: Menú Tradicional en Cueva La Martina" : "Lunch: Traditional Menu at Cave La Martina",
          description: isEs 
            ? "Comida tradicional manchega dentro de una cueva centenaria en pleno barrio del Albaicín."
            : "Dine on traditional Manchego recipes inside a centuries-old natural cave in the Albaicín district.",
          spots: ["spot4", "spot_plaza_mayor_park"]
        },
        {
          time: "15:30 - 18:30",
          title: isEs ? "Tarde: Bodega Histórica Vidal del Saz" : "Afternoon: Historic Vidal del Saz Winery",
          description: isEs 
            ? "Visita guiada por las barricas históricas y degustación de vinos de Bodegas Vidal del Saz."
            : "Guided tour through the oak barrels and wine tasting at the family-owned Bodegas Vidal del Saz.",
          spots: ["spot6", "spot10"]
        },
        {
          time: "18:30 - 21:00",
          title: isEs ? "Atardecer: Cueva Pastora Marcela y Albaicín" : "Sunset: Pastora Marcela Cave & Albaicín Walk",
          description: isEs 
            ? "Contempla las vistas al cerro desde las empinadas calles blancas y visita una auténtica vivienda excavada en la roca."
            : "Wander through the steep blue-and-white alleys of Albaicín and visit a fully furnished historic cave dwelling.",
          spots: ["spot_albaicin", "spot2"]
        }
      ]
    };
  }
}
