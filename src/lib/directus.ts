import { createDirectus, rest } from '@directus/sdk';

export const directusUrl = "https://nueljunt-backend-skripsi-nuel.hf.space"; 

export const directus = createDirectus(directusUrl).with(rest());