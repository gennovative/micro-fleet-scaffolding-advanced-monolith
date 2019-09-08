CREATE OR REPLACE FUNCTION public.next_id(OUT result bigint, table_name text) AS $$
    DECLARE
        our_epoch bigint := 576205200000; -- Unix timestamp in milisec
        seq_id bigint;
        now_millis bigint;
        shard_id int := 1; -- Worker ID
    BEGIN
        SELECT nextval('public.' || table_name || '_id_seq') % 1024 INTO seq_id;
        SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
        result := (now_millis - our_epoch) << 23;
        result := result | (shard_id <<10);
        result := result | (seq_id);
    END;
        $$ LANGUAGE PLPGSQL;

DROP SEQUENCE IF EXISTS public.mcft_tenants_id_seq;
CREATE SEQUENCE public.mcft_tenants_id_seq;
