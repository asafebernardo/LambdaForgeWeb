"use client";

import { useState } from "react";
import { sdk } from "@/lib/api";
import { RatingStars } from "./RatingStars";

interface ModRatingProps {
  modId: string;
  initialAverage: number;
  initialCount: number;
}

export function ModRating({ modId, initialAverage, initialCount }: ModRatingProps) {
  const [average, setAverage] = useState(initialAverage);
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState("");

  async function rate(score: number) {
    setError("");
    try {
      const result = await sdk.rateMod(modId, score);
      setAverage(result.average);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rating failed — log in to rate");
    }
  }

  return (
    <div>
      <RatingStars value={average} count={count} onRate={rate} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
