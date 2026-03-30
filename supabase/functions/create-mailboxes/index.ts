import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WINNR_API = "https://api.winnr.app";
const BISON_API = "https://send.leadgenjay.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Init Supabase client with user's JWT
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { mailboxes, domainName, domainId } = await req.json();
    // mailboxes: [{ username: "sarah.j", name: "Sarah Johnson" }, ...]
    // domainName: "kellerwilliams-homes.com"
    // domainId: UUID from agent_domains table

    if (!mailboxes?.length || !domainName || !domainId) {
      return new Response(
        JSON.stringify({ error: "Missing mailboxes, domainName, or domainId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const WINNR_KEY = Deno.env.get("WINNR_API_KEY");
    const BISON_KEY = Deno.env.get("BISON_API_KEY");

    if (!WINNR_KEY || !BISON_KEY) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ─── Step 1: Create mailboxes in Winnr ───────────────────────────
    console.log(
      `Step 1: Creating ${mailboxes.length} mailboxes on ${domainName} via Winnr`
    );

    const winnrPayload = {
      domain: domainName,
      users: mailboxes.map((m: { username: string; name: string }) => ({
        username: m.username,
        domain: domainName,
        name: m.name,
      })),
    };

    const winnrRes = await fetch(`${WINNR_API}/v1/email-users/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WINNR_KEY}`,
      },
      body: JSON.stringify(winnrPayload),
    });

    const winnrData = await winnrRes.json();

    if (!winnrRes.ok) {
      console.error("Winnr bulk create failed:", winnrData);
      return new Response(
        JSON.stringify({
          error: "Failed to create mailboxes in Winnr",
          details: winnrData,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      `Winnr created: ${winnrData?.data?.created || 0}, failed: ${winnrData?.data?.failed || 0}`
    );

    // Extract created mailbox IDs from Winnr response
    const winnrResults = winnrData?.data?.results || [];

    // ─── Step 2: Export mailboxes from Winnr as CSV ──────────────────
    console.log(
      `Step 2: Exporting mailboxes from Winnr for domain ${domainName}`
    );

    // Wait a moment for Winnr to fully provision
    await new Promise((r) => setTimeout(r, 2000));

    const exportRes = await fetch(`${WINNR_API}/v1/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WINNR_KEY}`,
      },
      body: JSON.stringify({
        format: "instantly",
        domains: [domainName],
      }),
    });

    const exportData = await exportRes.json();

    if (!exportRes.ok || !exportData?.data?.download_url) {
      console.error("Winnr export failed:", exportData);
      return new Response(
        JSON.stringify({
          error: "Failed to export mailboxes from Winnr",
          details: exportData,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Winnr export ready: ${exportData.data.count} mailboxes`);

    // ─── Step 3: Download CSV and transform to Bison format ─────────
    console.log("Step 3: Downloading and transforming CSV");

    const csvRes = await fetch(exportData.data.download_url);
    const winnrCsv = await csvRes.text();

    // Winnr Instantly format:
    // Email,First Name,Last Name,IMAP Username,IMAP Password,IMAP Host,IMAP Port,SMTP Username,SMTP Password,SMTP Host,SMTP Port,Daily Limit,Warmup Enabled,Warmup Limit,Warmup Increment

    // Bison format:
    // Name,Email,Password,IMAP Server,IMAP Port,SMTP Server,SMTP Port,Daily Limit,SMTP Secure,IMAP Secure

    const winnrRows = winnrCsv.trim().split("\n").slice(1); // skip header
    const bisonHeader =
      "Name,Email,Password,IMAP Server,IMAP Port,SMTP Server,SMTP Port,Daily Limit,SMTP Secure,IMAP Secure";

    const bisonRows = winnrRows
      .filter((row) => row.trim())
      .map((row) => {
        const cols = row.split(",");
        const email = cols[0];
        const firstName = cols[1];
        const lastName = cols[2];
        const imapPassword = cols[4];
        const imapHost = cols[5];
        const imapPort = cols[6];
        const smtpHost = cols[9];
        const smtpPort = cols[10];
        const dailyLimit = cols[11];

        return `${firstName} ${lastName},${email},${imapPassword},${imapHost},${imapPort},${smtpHost},${smtpPort},${dailyLimit},true,true`;
      });

    const bisonCsv = bisonHeader + "\n" + bisonRows.join("\n");

    console.log(`Transformed ${bisonRows.length} rows to Bison format`);

    // ─── Step 4: Upload CSV to Bison as sender emails ───────────────
    console.log("Step 4: Uploading sender emails to Bison");

    // Build multipart form data manually for Deno compatibility
    const boundary = "----FormBoundary" + Math.random().toString(36).slice(2);
    const multipartBody =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="csv"; filename="mailboxes.csv"\r\n` +
      `Content-Type: text/csv\r\n\r\n` +
      bisonCsv +
      `\r\n--${boundary}--\r\n`;

    const bisonSenderRes = await fetch(`${BISON_API}/api/sender-emails/bulk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BISON_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    const bisonSenderData = await bisonSenderRes.json();

    if (!bisonSenderRes.ok) {
      console.error("Bison sender email upload failed:", bisonSenderData);
      return new Response(
        JSON.stringify({
          error: "Failed to add sender emails to Bison",
          details: bisonSenderData,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const bisonSenders = bisonSenderData?.data || [];
    console.log(`Bison added ${bisonSenders.length} sender emails`);

    // ─── Step 5: Create Bison campaign for this agent ────────────────
    console.log("Step 5: Creating Bison campaign");

    // Get user's display name for campaign naming
    const displayName = mailboxes[0]?.name || "Agent";

    const bisonCampaignRes = await fetch(`${BISON_API}/api/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BISON_KEY}`,
      },
      body: JSON.stringify({
        name: `${displayName} - ${domainName}`,
        type: "outbound",
      }),
    });

    const bisonCampaignData = await bisonCampaignRes.json();

    if (!bisonCampaignRes.ok) {
      console.error("Bison campaign creation failed:", bisonCampaignData);
      return new Response(
        JSON.stringify({
          error: "Failed to create Bison campaign",
          details: bisonCampaignData,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const campaignUuid = bisonCampaignData?.data?.uuid;
    const campaignId = bisonCampaignData?.data?.id;
    console.log(`Bison campaign created: ${campaignUuid} (ID: ${campaignId})`);

    // ─── Step 5.5: Look up each sender email by address and attach to campaign ─
    console.log("Step 5.5: Looking up sender email IDs and attaching to campaign");

    const senderEmailIds: number[] = [];
    for (const m of mailboxes) {
      const emailAddr = `${m.username}@${domainName}`;
      const lookupRes = await fetch(
        `${BISON_API}/api/sender-emails/${encodeURIComponent(emailAddr)}`,
        { headers: { Authorization: `Bearer ${BISON_KEY}` } }
      );
      if (lookupRes.ok) {
        const lookupData = await lookupRes.json();
        if (lookupData?.data?.id) {
          senderEmailIds.push(lookupData.data.id);
        }
      }
    }

    console.log(`Found ${senderEmailIds.length} sender emails for ${domainName}`);

    if (senderEmailIds.length > 0 && campaignId) {
      const attachRes = await fetch(
        `${BISON_API}/api/campaigns/${campaignId}/attach-sender-emails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BISON_KEY}`,
          },
          body: JSON.stringify({
            sender_email_ids: senderEmailIds,
          }),
        }
      );

      const attachData = await attachRes.json();

      if (!attachRes.ok) {
        console.error("Bison attach sender emails failed:", attachData);
      } else {
        console.log(
          `Attached ${senderEmailIds.length} sender emails to campaign ${campaignId}`
        );
      }
    }

    // ─── Step 6: Save everything to Supabase ─────────────────────────
    console.log("Step 6: Saving to Supabase");

    // Use service role client for database writes (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Save mailboxes to agent_mailboxes
    const mailboxRecords = mailboxes.map(
      (m: { username: string; name: string }, i: number) => {
        const winnrResult = winnrResults[i];
        const bisonSender = bisonSenders.find(
          (s: { email: string }) =>
            s.email === `${m.username}@${domainName}`
        );

        return {
          agent_id: user.id,
          domain_id: domainId,
          email: `${m.username}@${domainName}`,
          display_name: m.name,
          username: m.username,
          status: "active",
          daily_limit: 10,
          sent_today: 0,
          total_sent: 0,
          health_score: 0,
          inbox_rate: 0,
          winnr_user_id: winnrResult?.id || winnrResult?.data?.id || null,
        };
      }
    );

    const { error: mailboxInsertError } = await supabaseAdmin
      .from("agent_mailboxes")
      .insert(mailboxRecords);

    if (mailboxInsertError) {
      console.error("Supabase mailbox insert failed:", mailboxInsertError);
    }

    // Save winnr mappings
    const mappings = mailboxRecords
      .filter((m: { winnr_user_id: string | null }) => m.winnr_user_id)
      .map((m: { winnr_user_id: string; email: string }) => {
        const bisonSender = bisonSenders.find(
          (s: { email: string }) => s.email === m.email
        );
        return {
          agent_id: user.id,
          resource_type: "mailbox",
          local_id: null, // will be set after insert
          winnr_id: m.winnr_user_id,
          instantly_id: bisonSender?.id?.toString() || null,
        };
      });

    // Save Bison campaign reference
    const { error: campaignSaveError } = await supabaseAdmin
      .from("winnr_mappings")
      .insert({
        agent_id: user.id,
        resource_type: "campaign",
        local_id: null,
        winnr_id: null,
        instantly_id: campaignUuid,
      });

    if (campaignSaveError) {
      console.error("Supabase campaign mapping insert failed:", campaignSaveError);
    }

    // ─── Done ────────────────────────────────────────────────────────
    console.log("All steps complete!");

    return new Response(
      JSON.stringify({
        success: true,
        winnr: {
          created: winnrData?.data?.created || 0,
          failed: winnrData?.data?.failed || 0,
        },
        bison: {
          senderEmails: bisonSenders.length,
          campaignUuid,
          campaignId,
        },
        mailboxes: mailboxRecords.map(
          (m: { email: string; display_name: string }) => ({
            email: m.email,
            name: m.display_name,
          })
        ),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
