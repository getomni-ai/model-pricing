/*
 * This file defines the pricing for the different model operations.
 */

// TRANSFORMS AND MODEL OPTIONS -------------------------------------------------

export enum Transforms {
  EMBEDDING = "EMBEDDING",
  FILL_MASK = "FILL_MASK",
  DIFFUSION_GENERATE = "DIFFUSION_GENERATE",
  PROMOTER_ACTIVITY = "PROMOTER_ACTIVITY",
  TRACKS_PREDICTION = "TRACKS_PREDICTION",
}

export enum ModelOptions {
  abdiffusion = "abdiffusion",
  borzoi_human_fold0 = "borzoi_human_fold0",
  lcdna = "lcdna",
  ginkgo_aa0_650M = "ginkgo-aa0-650M",
  esm2_650M = "esm2-650M",
  esm2_3B = "esm2-3B",
  ginkgo_maskedlm_3utr_v1 = "ginkgo-maskedlm-3utr-v1",
}

// REQUEST TYPES ----------------------------------------------------------------

export type MeanEmbeddingParams = {
  transform: Transforms.EMBEDDING;
  sequence: string;
  model:
    | ModelOptions.esm2_650M
    | ModelOptions.esm2_3B
    | ModelOptions.ginkgo_maskedlm_3utr_v1
    | ModelOptions.ginkgo_aa0_650M;
};

export type MaskedInferenceParams = {
  transform: Transforms.FILL_MASK;
  sequence: string;
  model:
    | ModelOptions.esm2_650M
    | ModelOptions.esm2_3B
    | ModelOptions.ginkgo_maskedlm_3utr_v1
    | ModelOptions.ginkgo_aa0_650M;
};

export type PromoterActivityParams = {
  transform: Transforms.PROMOTER_ACTIVITY;
  promoter_sequence: string;
  orf_sequence: string;
  tissue_of_interest: Record<string, string[]>;
  model: ModelOptions.borzoi_human_fold0;
};

export type TracksPredictionParams = {
  transform: Transforms.TRACKS_PREDICTION;
  sequence: string;
  tracks: string[];
  model: ModelOptions.borzoi_human_fold0;
};

export type DiffusionGenerateParams = {
  transform: Transforms.DIFFUSION_GENERATE;
  unmaskings_per_step: number;
  sequence: string;
  model: ModelOptions.abdiffusion | ModelOptions.lcdna;
};

// HELPER FUNCTIONS -------------------------------------------------------------

/**
 * Counts the number of tokens in a given sequence, counting special tokens as 1.
 *
 * @param sequence - The sequence to count tokens from.
 * @returns The number of tokens in the sequence.
 */
const getNumberOfTokens = (sequence: string): number => {
  const tokenPattern = /(<[^>]+>|[acdefghiklmnpqrstvwy])/g;
  const tokens = sequence.toLowerCase()?.match(tokenPattern);
  return tokens ? tokens.length : 0;
};

/**
 * Counts the number of masked tokens in a given sequence.
 *
 * @param sequence - The sequence to count masked tokens from.
 * @returns The number of masked tokens in the sequence.
 */
const getNumberOfMaskedTokens = (sequence: string): number => {
  const maskTokenPattern = /<mask>/g;
  const maskTokens = sequence.toLowerCase().match(maskTokenPattern);
  return maskTokens ? maskTokens.length : 0;
};

// PRICING FUNCTION --------------------------------------------------------------

/**
 * Calculates the pricing for a given model operation based on the provided parameters.
 *
 * @param params - The parameters for the model operation, including the sequence, model,
 * and transform type.
 * @returns The calculated pricing for the model operation.
 */
export function getModelPricing(
  params:
    | MeanEmbeddingParams
    | MaskedInferenceParams
    | PromoterActivityParams
    | TracksPredictionParams
    | DiffusionGenerateParams
): number {
  const TOKEN_COST_PER_MODEL = {
    [ModelOptions.esm2_650M]: 0.00000018,
    [ModelOptions.esm2_3B]: 0.00000025,
    [ModelOptions.ginkgo_maskedlm_3utr_v1]: 0.00000018,
    [ModelOptions.ginkgo_aa0_650M]: 0.00000018,
  };

  const COST_PER_MODEL_PASS = {
    [ModelOptions.borzoi_human_fold0]: 0.0025,
    [ModelOptions.abdiffusion]: 0.0002,
    [ModelOptions.lcdna]: 0.01,
  };

  switch (params.transform) {
    case Transforms.EMBEDDING:
      return (
        TOKEN_COST_PER_MODEL[params.model] * getNumberOfTokens(params.sequence)
      );

    case Transforms.FILL_MASK:
      return (
        TOKEN_COST_PER_MODEL[params.model] * getNumberOfTokens(params.sequence)
      );

    case Transforms.PROMOTER_ACTIVITY:
      return COST_PER_MODEL_PASS[ModelOptions.borzoi_human_fold0]; // Fixed price per request

    case Transforms.TRACKS_PREDICTION:
      return 0.003 + 0.00003 * params.tracks.length; // $0.003 + $0.00003*tracks.length

    case Transforms.DIFFUSION_GENERATE:
      const n_passes =
        getNumberOfMaskedTokens(params.sequence) / params.unmaskings_per_step;
      const pass_cost = COST_PER_MODEL_PASS[params.model];
      return pass_cost * n_passes;
  }
}
