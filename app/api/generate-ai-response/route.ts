import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API-sleutel niet geconfigureerd.' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const { reviewText, tone, businessName } = await request.json()

    if (!reviewText) {
      return NextResponse.json({ error: 'Geen reviewtekst meegegeven' }, { status: 400 })
    }

    // Uitgebreide lijst met 15 unieke stijlen
    const toneDescriptions: Record<string, string> = {
      empathic: 'zeer empathisch, warm en meelevend. Erken de teleurstelling en bied oprechte excuses aan.',
      professional: 'zakelijk, formeel, beleefd en gestructureerd. Richt je op kwaliteit en correcte procedures.',
      assertive: 'kordaat, direct, doortastend en oplossingsgericht. Geen omwegen, meteen actie.',
      inviting: 'uitnodigend en gastvrij. Leg de nadruk op een persoonlijk gesprek om de band te herstellen.',
      friendly: 'vriendelijk, toegankelijk en positief. Houd de toon ontspannen maar professioneel.',
      constructive: 'constructief en analyserend. Toon aan dat de feedback direct wordt gebruikt voor procesverbetering.',
      apologetic: 'diep verontschuldigend en schijnt licht op hoe we dit gaan goedmaken. Zonder defensief te zijn.',
      enthusiastic: 'enthousiast, energiek en dankbaar (ideaal voor positieve of milde reviews).',
      reassuring: 'geruststellend en kalmerend. Neem alle twijfels weg en straal maximale betrouwbaarheid uit.',
      humorous: 'licht, subtiel humoristisch en innemend (alleen toepassen als het past bij een lossere bedrijfscultuur).',
      concise: 'ultrakort, bondig en to the point. Geen franje, direct de kern.',
      formal: 'zeer formeel en hoogwaardig (u-vorm, uiterst correct en zakelijk correct).',
      solution_oriented: 'keihard gefocust op de praktische oplossing. Bied direct een concrete stap aan.',
      de_escalating: 'de-escalerend en diplomatisch. Haalt de angel uit een boze of gefrustreerde reactie.',
      vip_care: 'exclusief en attent. Geeft de klant het gevoel dat hij/zij een gewaardeerde VIP-relatie is.'
    }

    const selectedTone = toneDescriptions[tone] || toneDescriptions.empathic

    const prompt = `Reputatiemanager voor het Nederlandse bedrijf "${businessName || 'ons bedrijf'}". Schrijf een uniek, menselijk en origineel antwoord op deze review: "${reviewText}". Stijl/Toon: ${selectedTone}. Maximaal 4 zinnen. Sluit altijd af met een duidelijke uitnodiging om contact op te nemen of de oplossing in gang te zetten. Geen markdown, hashtags of aanhalingstekens om het antwoord heen.`

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    })

    const generatedText = response.text?.trim() || 'Antwoord kon niet worden geladen.'

    return NextResponse.json({ response: generatedText })
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    return NextResponse.json({ error: 'Verbinding duurde te lang of mislukte.' }, { status: 500 })
  }
}