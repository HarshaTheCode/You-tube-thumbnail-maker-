import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real application, you'd want to handle this more gracefully,
  // perhaps showing a message to the user in the UI.
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `
  Generate a professional, scroll-stopping YouTube video thumbnail in a 1280x720 (16:9) aspect ratio.

  The first image provided is the subject's headshot.

  Instructions:
  1.  **Subject:** Use the headshot photo as the main subject. Place it prominently.
  2.  **Facial Expression & Character Consistency:** Analyze the video title's tone and realistically adjust the subject's facial expression to match it (e.g., excited, shocked, serious, happy). It is CRITICAL to maintain the likeness of the person from the headshot. Do NOT change their core features. The goal is to make it look like the same person reacting, not a different person.
  3.  **Typography:** Integrate the video title text using bold, modern, and eye-catching typography. Ensure it is highly readable and visually integrated with the scene.
  4.  **Design Style:** Create a visually stunning background and overall composition with the following elements:
      -   **High Contrast:** Strong differences between light and dark areas to grab attention.
      -   **Vibrant Colors:** Use a saturated and compelling color palette that stands out.
      -   **Glowing Highlights:** Add subtle glows and highlights to the subject and text to make them pop.
      -   **Cinematic Depth of Field:** Create a blurred background (bokeh effect) to make the subject and text stand out sharply.
      -   **Modern Text Placement:** Arrange the text dynamically around the subject for maximum impact.
  5.  **Overall Goal:** The final image must be a fully optimized, professional YouTube thumbnail designed to maximize click-through rate. Do not include any branding or watermarks.
`;

const REFERENCE_STYLE_PROMPT = `
  **Style Reference:** The second image provided is a style reference. Deeply analyze this image's artistic style, including its color grading, typography, composition, lighting, and any special effects. Apply a similar high-quality, professional aesthetic to the new thumbnail you are creating. The goal is to mimic the *style* of the reference, not its content.
`;

const BACKGROUND_INSTRUCTION_PROMPT_WITH_REF = `
  **Background Reference:** The third image provided is a background reference. Use this image as strong inspiration for the background of the thumbnail. Re-create the style, mood, and key elements of this reference image, but adapt and enhance it to perfectly complement the main subject's headshot and the video title's theme. The final background must be seamlessly integrated into a cohesive, professional thumbnail.
`;

const BACKGROUND_INSTRUCTION_PROMPT_NO_REF = `
  **Background Reference:** The second image provided is a background reference. Use this image as strong inspiration for the background of the thumbnail. Re-create the style, mood, and key elements of this reference image, but adapt and enhance it to perfectly complement the main subject's headshot and the video title's theme. The final background must be seamlessly integrated into a cohesive, professional thumbnail.
`;


export const generateThumbnail = async (
  videoTitle: string,
  headshotBase64: string,
  headshotMimeType: string,
  referenceBase64?: string,
  referenceMimeType?: string,
  backgroundBase64?: string,
  backgroundMimeType?: string
): Promise<string> => {
  const model = "gemini-2.5-flash-image-preview";

  let fullPrompt = `Video Title: "${videoTitle}"\n\n${BASE_PROMPT}`;
  
  const parts: any[] = [
    {
      inlineData: {
        data: headshotBase64,
        mimeType: headshotMimeType,
      },
    },
  ];

  if (referenceBase64 && referenceMimeType) {
    fullPrompt += REFERENCE_STYLE_PROMPT;
    parts.push({
      inlineData: {
        data: referenceBase64,
        mimeType: referenceMimeType,
      },
    });
  }

  if (backgroundBase64 && backgroundMimeType) {
    fullPrompt += referenceBase64 ? BACKGROUND_INSTRUCTION_PROMPT_WITH_REF : BACKGROUND_INSTRUCTION_PROMPT_NO_REF;
    parts.push({
      inlineData: {
        data: backgroundBase64,
        mimeType: backgroundMimeType,
      },
    });
  }

  parts.push({ text: fullPrompt });


  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    // If no image part is found, check for a text response explaining why
    if (response.text) {
        throw new Error(`API returned text instead of an image: ${response.text}`);
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the thumbnail.");
  }
};