import { createFileRoute } from "@tanstack/react-router";
import { createMenuClient } from "@/lib/menu.functions";

// Public on purpose: the guest wheel reads its title, spin limit and prize list.
// Only display fields are returned; daily win counts stay server-side.
export const Route = createFileRoute("/api/public/wheel-config")({
  server: {
    handlers: {
      GET: async () => {
        const client = createMenuClient(process.env["SUPABASE_URL"], process.env["SUPABASE_PUBLISHABLE_KEY"]);
        const { data, error } = await client.from("wheel_settings").select("title, subtitle, max_spins, prizes").eq("id", 1).single();
        if (error || !data) return Response.json({ error: "unavailable" }, { status: 503 });
        const prizes = ((data.prizes ?? []) as { t: string; e: string; c: string; x?: boolean }[]).map(({ t, e, c, x }) => ({ t, e, c, x: !!x }));
        return Response.json({ title: data.title, subtitle: data.subtitle, max_spins: data.max_spins, prizes }, { headers: { "cache-control": "no-store" } });
      },
    },
  },
});
