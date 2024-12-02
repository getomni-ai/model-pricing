enum Transforms {
  EMBEDDING = "EMBEDDING",
  FILL_MASK = "FILL_MASK",
  GENERATE = "GENERATE",
  PROMOTER_ACTIVITY = "PROMOTER_ACTIVITY",
  TRACKS_PREDICTION = "TRACKS_PREDICTION",
}

enum ModelOptions {
  abdiffusion = "abdiffusion",
  borzoi_dna = "borzoi_dna",
  borzoi_human_fold0 = "borzoi_human_fold0",
  lcdna = "lcdna",
}

interface ModelPricingOptions {
  model: ModelOptions;
  sequence: string;
  tracks: number[];
  transform: Transforms;
}

// Tokenizes the sequence with one token per mask (<cls>, <eos>, <pad>, <mask>)
// and one token per amino acid (ACDEFGHIKLMNPQRSTVWY)
const getMaskTokens = (sequence: string): number => {
  const tokenPattern = /(<[^>]+>|[ACDEFGHIKLMNPQRSTVWY])/g;
  const tokens = sequence?.match(tokenPattern);
  return tokens ? tokens.length : 0;
};

export function getModelPricing({
  model,
  sequence,
  tracks,
  transform,
}: ModelPricingOptions): number {
  let price = 0;

  switch (model) {
    case ModelOptions.borzoi_dna:
      // Fixed price per request
      price = 0.0025;
      break;

    case ModelOptions.borzoi_human_fold0:
      // Fixed price per request for PROMOTER_ACTIVITY
      if (transform === Transforms.PROMOTER_ACTIVITY) {
        price = 0.0025;
      }
      // $0.003 + $0.00003*tracks.length for TRACKS_PREDICTION
      // The output size grows with the number of tracks (up to 7000) and so file transfer becomes costly.
      if (transform === Transforms.TRACKS_PREDICTION) {
        price = 0.003 + 0.00003 * tracks.length;
      }
      break;

    case ModelOptions.abdiffusion:
      // $0.0002 per mask token in the sequence
      const numMasks = getMaskTokens(sequence);
      price = 0.0002 * numMasks;
      break;

    case ModelOptions.lcdna:
      // Fixed price per request up to 30,000 nucleotide characters
      const sequenceLength = sequence.length;
      if (sequenceLength <= 30000) {
        price = 0.01;
      } else {
        // Handle sequences longer than 30,000 nucleotides
        // Assuming an additional cost per extra nucleotide
        const extraNucleotides = sequenceLength - 30000;
        price = 0.01 + 0.00001 * extraNucleotides;
      }
      break;

    default:
      throw new Error(`Model "${model}" not recognized.`);
  }

  return price;
}
