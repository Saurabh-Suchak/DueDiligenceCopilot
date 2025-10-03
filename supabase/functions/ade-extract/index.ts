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
    const markdown = formData.get("markdown");
    const markdownUrl = formData.get("markdown_url");
    const schema = formData.get("schema");
    const model = formData.get("model") || "extract-latest";

    if (!markdown && !markdownUrl) {
      return new Response(
        JSON.stringify({ error: "Either markdown or markdown_url must be provided" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!schema) {
      return new Response(
        JSON.stringify({ error: "Schema is required" }),
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
    if (markdown) {
      landingAiForm.append("markdown", markdown);
    }
    if (markdownUrl) {
      landingAiForm.append("markdown_url", markdownUrl as string);
    }
    landingAiForm.append("schema", schema as string);
    landingAiForm.append("model", model as string);

    const response = await fetch("https://api.va.landing.ai/v1/ade/extract", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: landingAiForm,
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to extract data", details: data }),
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
    console.error("Error in ade-extract:", error);
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