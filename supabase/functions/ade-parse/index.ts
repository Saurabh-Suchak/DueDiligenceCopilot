import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();
    const document = formData.get("document");
    const documentUrl = formData.get("document_url");
    const model = formData.get("model") || "dpt-2-latest";
    const split = formData.get("split");

    if (!document && !documentUrl) {
      return new Response(
        JSON.stringify({ error: "Either document or document_url must be provided" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = Deno.env.get("LANDING_AI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "LANDING_AI_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const landingAiForm = new FormData();
    if (document) {
      landingAiForm.append("document", document);
    }
    if (documentUrl) {
      landingAiForm.append("document_url", documentUrl as string);
    }
    landingAiForm.append("model", model as string);
    if (split) {
      landingAiForm.append("split", split as string);
    }

    const response = await fetch("https://api.va.landing.ai/v1/ade/parse", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: landingAiForm,
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to parse document", details: data }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in ade-parse:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});