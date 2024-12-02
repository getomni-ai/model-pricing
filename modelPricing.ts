enum Transform {
  PROMOTER_ACTIVITY = "PROMOTER_ACTIVITY",
  TRACKS_PREDICTION = "TRACKS_PREDICTION",
  FILL_MASK = "FILL_MASK",
  GENERATE = "GENERATE",
  EMBEDDING = "EMBEDDING",
}

interface ModelPricingOptions {
  model: string;
  sequence: string;
  transform: Transform;
}

export function getModelPricing({
  model,
  sequence,
  transform,
}: ModelPricingOptions): number {
  let price = 0;

  switch (model) {
    case "borzoi_dna":
      // Fixed price per request
      price = 0.0025;
      break;

    case "borzoi_human_fold0":
      // lenTracks is the count of 'TRACK' substrings in the sequence
      const lenTracks = (sequence.match(/TRACK/g) || []).length;
      price = 0.003 + 0.00003 * lenTracks;
      break;

    case "abdiffusion":
      // numMasks is the count of '<mask>' substrings in the sequence
      const numMasks = (sequence.match(/<mask>/g) || []).length;
      price = 0.0002 * numMasks;
      break;

    case "lcdna":
      // Fixed price per request up to 30,000 nucleotide characters
      const sequenceLength = sequence.length;
      if (sequenceLength <= 30000) {
        price = 0.01;
      } else {
        // Handle sequences longer than 30,000 nucleotides
        const extraNucleotides = sequenceLength - 30000;
        // Assuming an additional cost per extra nucleotide
        price = 0.01 + 0.0000001 * extraNucleotides;
      }
      break;

    default:
      throw new Error(`Model "${model}" not recognized.`);
  }

  return price;
}
