import {
  getModelPricing,
  PromoterActivityParams,
  MeanEmbeddingParams,
  MaskedInferenceParams,
  DiffusionGenerateParams,
  Transforms,
  ModelOptions,
} from "./modelPricing";

// Mean Embedding ----------------------------------------------------------------

const mean_embedding_params: MeanEmbeddingParams = {
  sequence: "ATGGTGCTGCCACAGTAAATGTAGCCACTATGCCTATCTCCATTCTCAAGATGTGT",
  model: ModelOptions.ginkgo_maskedlm_3utr_v1,
  transform: Transforms.EMBEDDING,
};
console.log({
  scenario: "mean_embedding",
  price: getModelPricing(mean_embedding_params),
});

// Masked Inference --------------------------------------------------------------

const masked_inference_params: MaskedInferenceParams = {
  sequence:
    "ATGG<MASK>TGCTGCCACAGTAAATGTAGCCACTATGCC<MASK>TATCTCCATTCTCAAGATGTGT",
  model: ModelOptions.ginkgo_maskedlm_3utr_v1,
  transform: Transforms.FILL_MASK,
};
console.log({
  scenario: "masked_inference",
  price: getModelPricing(masked_inference_params),
});

// Promoter Activity ------------------------------------------------------------

const promoter_activity_params: PromoterActivityParams = {
  promoter_sequence:
    "GTCCCACTGATGAACTGTGCTGCCACAGTAAATGTAGCCACTATGCCTATCTCCATTCTCAAGATGTGTCACTTCCTGTT",
  orf_sequence:
    "tgccagccatctgttgtttgcccctcccccgtgccttccttgaccctggaaggtgccactcccactgtcctttcctaat",
  tissue_of_interest: {
    heart: ["CNhs10608+", "CNhs10612+"],
    liver: ["CNhs10608+", "CNhs10612+"],
  },
  model: ModelOptions.borzoi_human_fold0,
  transform: Transforms.PROMOTER_ACTIVITY,
};
console.log({
  scenario: "promoter_activity",
  price: getModelPricing(promoter_activity_params),
});

// Diffusion Generation ----------------------------------------------------------

const diffusion_generation_params: DiffusionGenerateParams = {
  sequence:
    "MKLLM<MASK><MASK><MASK><MASK>MKL<MASK><MASK><MASK><MASK><MASK><MASK><MASK>MKL",
  model: ModelOptions.abdiffusion,
  transform: Transforms.DIFFUSION_GENERATE,
  unmaskings_per_step: 3,
};
console.log({
  scenario: "diffusion_generation",
  price: getModelPricing(diffusion_generation_params),
});
