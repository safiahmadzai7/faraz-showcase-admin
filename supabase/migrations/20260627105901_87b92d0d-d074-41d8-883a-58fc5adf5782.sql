
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'uploads');
