
CREATE POLICY "Public can view site content"
ON public.site_content
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Deny public insert on site_content"
ON public.site_content
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny public update on site_content"
ON public.site_content
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete on site_content"
ON public.site_content
FOR DELETE
TO anon, authenticated
USING (false);
