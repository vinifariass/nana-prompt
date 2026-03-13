import sharp from "sharp";
import path from "path";
import fs from "fs";

export async function applyWatermark(inputPath: string, outputPath: string) {
    const watermarkText = "Nana Prompt";

    // Create an SVG for the watermark
    const svg = `
    <svg width="400" height="100">
      <style>
        .text { fill: rgba(255, 255, 255, 0.4); font-size: 40px; font-weight: bold; font-family: sans-serif; }
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="text">${watermarkText}</text>
    </svg>`;

    const svgBuffer = Buffer.from(svg);

    await sharp(inputPath)
        .composite([
            {
                input: svgBuffer,
                gravity: "southeast",
            },
        ])
        .toFile(outputPath);
}
