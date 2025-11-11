import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { email, user_name } = await req.json();

    const serviceID = "service_ogmpi07"; // 🔹 tu Service ID
    const templateID = "service_ogmpi07";  // 🔹 tu Template ID
    const publicKey = "OmZBWhVYt4J-7E6ib"; // 🔹 tu Public Key

    const payload = {
      service_id: serviceID,
      template_id: templateID,
      user_id: publicKey,
      template_params: {
        user_name,
        user_email: email,
      },
    };

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("📨 EmailJS Response:", text);

    return new Response(JSON.stringify({ success: true, text }), { status: 200 });
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
