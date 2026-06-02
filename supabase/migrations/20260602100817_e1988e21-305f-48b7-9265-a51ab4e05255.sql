-- Tabela singleton de configurações da clínica
CREATE TABLE public.settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  clinic_name TEXT NOT NULL DEFAULT 'Aline Home Spa Prime',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  instagram TEXT,
  confirmation_message TEXT NOT NULL DEFAULT 'Olá! Confirmando seu atendimento na Aline Home Spa Prime no dia [data] às [hora]. ✨',
  availability JSONB NOT NULL DEFAULT '{
    "0": {"enabled": false, "start": "09:00", "end": "18:00"},
    "1": {"enabled": true,  "start": "09:00", "end": "18:00"},
    "2": {"enabled": true,  "start": "09:00", "end": "18:00"},
    "3": {"enabled": true,  "start": "09:00", "end": "18:00"},
    "4": {"enabled": true,  "start": "09:00", "end": "18:00"},
    "5": {"enabled": true,  "start": "09:00", "end": "18:00"},
    "6": {"enabled": false, "start": "09:00", "end": "14:00"}
  }'::jsonb,
  blocked_dates TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins update settings" ON public.settings
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert settings" ON public.settings
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed singleton
INSERT INTO public.settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER settings_set_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();