import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Set environment variable for the app (Vite handles this usually via .env or process.env during build,
        # but in dev it might be different. Here we assume the server is already running with it)

        try:
            await page.goto("http://localhost:3000", timeout=5000)
        except:
            await page.goto("http://localhost:3001", timeout=5000)

        # Wait for the terminal to show logs
        await page.wait_for_timeout(3000)

        # Check if "VITE_GEMINI_API_KEY detected and loaded." or "No API Key found" is present
        content = await page.content()
        if "VITE_GEMINI_API_KEY detected and loaded." in content:
            print("SUCCESS: API Key detected in logs.")
        elif "No API Key found in environment" in content:
            print("INFO: No API Key found in environment (expected if not set).")
        else:
            print("WARNING: Neither success nor warning message found in logs.")

        # Take a screenshot
        await page.screenshot(path="final_verification_v2.png", full_page=True)
        print("Screenshot saved to final_verification_v2.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
