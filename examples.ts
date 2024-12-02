const borzoi_human_fold0_test = {
  prom: "GTCCCACTGATGAACTGTGCTGCCACAGTAAATGTAGCCACTATGCCTATCTCCATTCTCAAGATGTGTCACTTCCTGTTTCAGACTCAAATCAGCCACAGTGGCAGAAGCCCACGAAATCAGAGGTGAAATTTAATAATGACCACTGCCCATTCTCTTCACTTGTCCCAAGAGGCCATTGGAAATAGTCCAAAGACCCATTGAGGGAGATGGACATTATTTCCCAGAAGTAAATACAGCTCAGCTTGTACTTTGGTACAACTAATCGACCTTACCACTTTCACAATCTGCTAGCAAAGGTTA",
  orf: "tgccagccatctgttgtttgcccctcccccgtgccttccttgaccctggaaggtgccactcccactgtcctttcctaataaaatgaggaaattgcatcgcattgtctgagtaggtgtcattctattctggggggtggggtggggcaggacagcaagggggaggattgggaagacaatagcaggcatgctggggatgcggtgggctctatgg",
  tissue_of_interest: {
    heart: ["CNhs10608+", "CNhs10612+"],
    liver: ["CNhs10608+", "CNhs10612+"],
  },
};

const abdiffusion_fill_mask_test = {
  sequence: "AAAA <MASK> <MASK>(<MASK>AAAAA)",
  temperature: 1.0,
  decoding_order_strategy: "entropy",
};

const abdiffusion_generate_test = {
  length: 128,
  temperature: 1.0,
  decoding_order_strategy: "entropy",
};

const icdna_fill_mask_test = { sequence: "atgrywggn<mask><unk><pad>" };

const icdna_embedding_test = { sequence: "atgrywggn<mask><unk><pad>" };

const icdna_generate_test = {
  sequence: "atgrywggn<mask><unk><pad>",
  temperature: 1.0,
  decoding_order_strategy: "entropy",
  frac_to_decode_per_step: 0.1,
};
